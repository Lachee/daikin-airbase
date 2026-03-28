import { Client, basic_info, discover, type SensorInfoResponse, get_sensor_info, } from './api';

import type { DiscoveredDevice } from './api'
import { Zones } from "./Zones";
import { type BasicInfo, type ControlInfo, ControlMode, FanSpeed, RemoteType, type SensorInfo, Status } from "./Types";
import { get_control_info } from "./api/aircon/get_control_info";
import { type ControlInfoRequestParam, set_control_info } from "./api/aircon/set_control_info";
import { bool, int } from "./ParamParser";

type DeviceOption = {
  device: DiscoveredDevice;
}
type HostOption = {
  host: string;
}

export type DaikinClientOptions = (DeviceOption | HostOption) & {
  password?: string;
};

export type Fan = {
  speed: FanSpeed,
  auto: boolean,
  airside?: boolean,
};

export class DaikinClient {

  private readonly options: DaikinClientOptions;

  public readonly api: Client;
  public readonly zones: Zones;
  private cachedControlInfo: ControlInfo | undefined;
  private cachedSensorInfo: SensorInfo | undefined;

  public constructor(options: DaikinClientOptions) {
    this.options = options;
    if ('host' in options) {
      this.api = new Client(options.host);
    } else {
      this.api = new Client(options.device.discoveredAddress);
    }
    this.zones = new Zones(this);
  }

  /**
   * Gets the current state of the aircon.
   * @returns the current state of the aircon.
   */
  async getControlInfo(): Promise<ControlInfo> {
    // TODO: Add smarter caching and rate limiting of the responses.
    const response = await get_control_info(this.api);
    const responseValues = Object.entries(response);
    return this.cachedControlInfo = {
      mode:                  Number(response.mode) as ControlMode,
      fanSpeed:              Number(response.f_rate) as FanSpeed,
      fanAuto:               response.f_auto != 0,
      fanAirside:            response.f_airside != 0,
      targetTemperature:     response.stemp,
      controlTemperature:    responseValues.filter(([ k, v ]) => k.startsWith("dt")).map(([ k, v ]) => +v),
      power:                 response.pow != 0,
      status:                Number(response.operate) as Status,
      swinging:              response.f_dir != 0,
      isFilterDirty:         response.filter_sign_info != 0,
      isCentrallyControlled: response.cent != 0,
      remoteControlType:     Number(response.remo) as RemoteType
    }
  }

  /** Gets the cached state of the aircon. */
  getCachedControlInfo(): ControlInfo | undefined {
    return this.cachedControlInfo;
  }

  /**
   * Retrieves the power state of the unit.
   */
  async getPowered(): Promise<boolean> {
    return (await this.getControlInfo()).power;
  }

  /**
   * Sets the powered state of the unit.
   * @param state true to turn the unit on.
   */
  async setPowered(state: boolean): Promise<void> {
    return await this.setControlInfo({ power: state });
  }

  /**
   * Gets the current mode of the unit.
   */
  async getMode(): Promise<ControlMode> {
    return (await this.getControlInfo()).mode;
  }

  /**
   * Sets the mode of the unit.
   * @param mode The mode to set
   */
  async setMode(mode: ControlMode): Promise<void> {
    return await this.setControlInfo({ mode });
  }

  /**
   * Gets the current fan settings of the unit.
   * @returns the current fan settings.
   */
  async getFan(): Promise<Fan> {
    const info = await this.getControlInfo();
    return {
      speed:   info.fanSpeed,
      auto:    info.fanAuto,
      airside: info.fanAirside
    }
  }

  /**
   * Sets the fan settings of the unit.
   * @param fan the fan settings to set.
   */
  async setFan(fan: Fan): Promise<void> {
    return await this.setControlInfo({ fanSpeed: fan.speed, fanAuto: fan.auto, fanAirside: fan.airside ?? false });
  }

  /**
   * Gets the current target temperature of the unit
   */
  async getTargetTemperature(): Promise<number> {
    return (await this.getControlInfo()).targetTemperature;
  }

  /**
   * Sets the target temperature of the unit.
   * @param temperature the temperature to set. This is rounded to the nearest integer.
   */
  async setTargetTemperature(temperature: number): Promise<void> {
    return await this.setControlInfo({ targetTemperature: temperature });
  }

  /** Gets the current status of the unit. */
  async getStatus(): Promise<Status> {
    return (await this.getControlInfo()).status;
  }

  /** Sets the control state of the unit. */
  async setControlInfo(info: Partial<ControlInfo>) {
    const latest = await this.getControlInfo();
    const update = { ...latest, ...info };

    const params: ControlInfoRequestParam = {
      f_airside: 0,
      f_auto:    bool(update.fanAuto),
      f_dir:     bool(update.swinging),
      f_rate:    int(update.fanSpeed),
      mode:      int(update.mode),
      pow:       bool(update.power),
      stemp:     int(update.targetTemperature)
    };

    if (update.fanAirside) {
      params.f_airside = 1;
      params.f_auto = 0;
      params.f_dir = 0;
    }

    const response = await set_control_info(this.api, params);
    if (response.ret !== 'OK')
      throw new Error(`Failed to update control info: ${response.ret}`);

    this.cachedControlInfo = update;
  }

  /**
   * Get the current reading of the temperature sensors.
   */
  async getSensorInfo(): Promise<SensorInfo> {
    const response = await get_sensor_info(this.api);
    return this.cachedSensorInfo = {
      insideTemperature:  response.htemp,
      outsideTemperature: response.otemp === '-' ? undefined : response.otemp,
    };
  }

  /** Gets the current indoor temperature reading. */
  async getInsideTemperature(): Promise<number> {
    return (await this.getSensorInfo()).insideTemperature;
  }

  /** Gets the current outdoor temperature reading. */
  async getOutsideTemperature(): Promise<number | undefined> {
    return (await this.getSensorInfo()).outsideTemperature;
  }

  /** Gets the cached state of the sensor info. */
  getCachedSensorInfo(): SensorInfo | undefined {
    return this.cachedSensorInfo;
  }

  /**
   * Gets the basic information about the aircon.
   * @returns the basic information about the aircon.
   */
  async getBasicInfo(): Promise<BasicInfo> {
    const response = await basic_info(this.api);
    return {
      type:     response.type,
      region:   response.reg,
      version:  response.ver,
      name:     response.name,
      method:   response.method,
      port:     response.port,
      id:       response.id,
      password: response.pw,
      ssid:     response.ssid,
      led:      response.led === 1,
      adp_mode: response.adp_mode,
      adp_kind: response.adp_kind,
    }
  }

  /** Broadcasts a request to discover devices on the network. */
  static async discover(timeoutMs = 3000) {
    return discover(timeoutMs);
  }
}