import { Client, basic_info, discover, } from './api';

import type { DiscoveredDevice } from './api'
import { Zones } from "./Zones";
import { type BasicInfo, type ControlInfo, ControlMode, FanSpeed, RemoteType, Status } from "./Types";
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

  public constructor(options: DaikinClientOptions) {
    this.options = options;
    if ('host' in options) {
      this.api = new Client(options.host);
    } else {
      this.api = new Client(options.device.discoveredAddress);
    }
    this.zones = new Zones(this);
  }

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
      sensorTemperatures:    responseValues.filter(([ k, v ]) => k.startsWith("dt")).map(([ k, v ]) => +v),
      power:                 response.pow != 0,
      status:                Number(response.operate) as Status,
      swinging:              response.f_dir != 0,
      isFilterDirty:         response.filter_sign_info != 0,
      isCentrallyControlled: response.cent != 0,
      remoteControlType:     Number(response.remo) as RemoteType
    }
  }

  getCachedControlInfo(): ControlInfo | undefined {
    return this.cachedControlInfo;
  }

  async getPowered(): Promise<boolean> {
    return (await this.getControlInfo()).power;
  }

  async setPowered(state: boolean): Promise<void> {
    return await this.setControlInfo({ power: state });
  }

  async getMode(): Promise<ControlMode> {
    return (await this.getControlInfo()).mode;
  }

  async setMode(mode: ControlMode): Promise<void> {
    return await this.setControlInfo({ mode });
  }

  async getFan(): Promise<Fan> {
    const info = await this.getControlInfo();
    return {
      speed:   info.fanSpeed,
      auto:    info.fanAuto,
      airside: info.fanAirside
    }
  }

  async setFan(fan: Fan): Promise<void> {
    return await this.setControlInfo({ fanSpeed: fan.speed, fanAuto: fan.auto, fanAirside: fan.airside ?? false });
  }

  async getTargetTemperature(): Promise<number> {
    return (await this.getControlInfo()).targetTemperature;
  }

  async setTargetTemperature(temperature: number): Promise<void> {
    return await this.setControlInfo({ targetTemperature: temperature });
  }

  async getSensorTemperatures(): Promise<number[]> {
    return (await this.getControlInfo()).sensorTemperatures;
  }

  async getStatus(): Promise<Status> {
    return (await this.getControlInfo()).status;
  }

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