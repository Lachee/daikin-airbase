import type { DaikinClient } from "./DaikinClient";
import { get_zone_settings } from "./api";
import { set_zone_setting } from "./api/aircon/set_zone_setting";
import { bool, int } from "./ParamParser";

export type Zone = {
  /** The index of the zone in the airbase controller. */
  index: number;
  /** The name of the zone. */
  name: string;
  /** The zone is on and flowing air. */
  isOn: boolean;
  /** The set humidity of the zone. Not available on all units. */
  humidity?: number;
  /** The set temperature of the zone. Not available on all units. */
  temperature?: number;
};
type ReadonlyZone = Readonly<Zone>;

/** Manages all the zones on the airbase controller. */
export class Zones {
  private zones: ReadonlyZone[] = [];
  private readonly client: DaikinClient;

  constructor(client: DaikinClient) {
    this.client = client;
  }

  /**
   * Requests all the zones current state from the airbase controller.
   * Results are cached.
   * @returns the current state of all zones.
   */
  async getZones(): Promise<ReadonlyZone[]> {
    const response = await get_zone_settings(this.client.api);
    const names = response.zone_name.split(";");
    const onoff = response.zone_onoff.split(";");
    const temprartures = response.lztemp_c ? response.lztemp_c.split(";") : null;
    const humidities = response.lztemp_h ? response.lztemp_h.split(";") : null;

    return this.zones = names.map((name, index) => Object.freeze<Zone>({
      index,
      name,
      isOn:        onoff[index] === '1',
      humidity:    humidities ? +`${humidities[index]}` : undefined,
      temperature: temprartures ? +`${temprartures[index]}` : undefined,
    }));
  }

  /**
   * Gets the state of all cached zones.
   */
  getCachedZones(): ReadonlyZone[] {
    return this.zones;
  }

  /**
   * Gets the current state of a zone with the matching name.
   * @param name
   */
  async getZone(name: string): Promise<ReadonlyZone | undefined> {
    return await this.getZones().then(() => this.getCachedZone(name));
  }

  /**
   * Gets the current state of a zone at the given controller index.
   * @param index
   * @throws Error if the index is out of bounds.
   */
  async getZoneAt(index: number): Promise<ReadonlyZone> {
    return await this.getZones().then(() => this.getCachedZoneAt(index));
  }

  /**
   * Gets the cached state of a zone
   * @param name
   */
  getCachedZone(name: string): ReadonlyZone | undefined {
    return this.zones.find((zone) => zone.name === name);
  }

  /**
   * Gets the cached state of a zone at the given controller index.
   * @param index
   * @throws Error if the index is out of bounds.
   */
  getCachedZoneAt(index: number): ReadonlyZone {
    if (index < 0 || index >= this.zones.length || this.zones[index] === undefined)
      throw new Error(`Zone index ${index} is out of bounds`);
    if (this.zones[index].index !== index)
      throw new Error(`Zone at ${index} does not believe it is in the correct spot.`);
    return this.zones[index];
  }

  /**
   * Updates a zone
   * @param name the name of the zone to update
   * @param info the new data to replace
   */
  async updateZone(name: string, info: Partial<Zone>): Promise<ReadonlyZone> {
    const zones = await this.getZones();
    const index = zones.findIndex((zone) => zone.name === name);
    zones[index] = { ...zones[index], ...info } as ReadonlyZone;
    await this.setZones(zones);
    return zones[index];
  }

  /**
   * Bulk updates all the zones
   * @param zones the new zones. These are sorted by index and pushed into the API in that order.
   * @returns the updated zones
   */
  async setZones(zones: Zone[]): Promise<ReadonlyZone[]> {
    let names: string[] = [];
    let onoff: string[] = [];
    let humidity: string[] = [];
    let temperature: string[] = [];

    const sortedZones = zones.sort((a, b) => a.index - b.index);
    for (const zone of sortedZones) {
      names.push(zone.name);
      onoff.push(`${bool(zone.isOn)}`);
      if (zone.humidity !== undefined)
        humidity.push(`${int(zone.humidity)}`);
      if (zone.temperature !== undefined)
        temperature.push(`${int(zone.temperature)}`)
    }

    const response = await set_zone_setting(this.client.api, {
      zone_name:  names.join(";"),
      zone_onoff: onoff.join(";"),
      lztemp_h:   humidity.length > 0 ? humidity.join(";") : undefined,
      lztemp_c:   temperature.length > 0 ? temperature.join(";") : undefined,
    });

    if (response.ret !== 'OK')
      throw new Error(`Failed to set zones: ${response.ret}`);

    return this.zones = zones.map((zone) => Object.freeze({ ...zone }));
  }
}