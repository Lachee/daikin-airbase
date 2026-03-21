import type { DaikinClient } from "./DaikinClient";
import { get_zone_settings } from "./api";
import { set_zone_setting } from "./api/aircon/set_zone_setting";

export type ZoneState = {
    name: string;
    state: boolean;
};

export class Zones {
    private zones: ZoneState[] = [];
    private readonly client: DaikinClient;

    constructor(client: DaikinClient) {
        this.client = client;
    }

    async refresh(): Promise<ZoneState[]> {
        const response = await get_zone_settings(this.client.api);
        const zoneNames = response.zone_name.split(";");
        const zoneState = response.zone_onoff.split(";");

        return this.zones = zoneNames.map((name, index) => ({
            name,
            state: zoneState[index] === "1",
        }));
    }

    getCachedZones(): ZoneState[] {
        return [...this.zones];
    }

    async getZones(): Promise<ZoneState[]> {
        return await this.refresh();
    }

    getCachedZone(name : string) : boolean | undefined {
        return this.zones.find((zone) => zone.name === name)?.state;
    }

    async getZone(name: string): Promise<boolean | undefined> {
        const zones = await this.refresh();
        return zones.find((zone) => zone.name === name)?.state;
    }

    async setZone(name: string, state: boolean): Promise<void> {
        await this.setZones([{ name, state }]);
    }

    async setZones(changes: ZoneState[]): Promise<void> {
        await this.refresh();

        for (const change of changes) {
            const existingZone = this.zones.find((z) => z.name === change.name);
            if (existingZone) {
                existingZone.state = change.state;
            }
        }

        const response = await set_zone_setting(this.client.api, {
            zone_name: this.zones.map((zone) => zone.name).join(";"),
            zone_onoff: this.zones.map((zone) => (zone.state ? "1" : "0")).join(";"),
        });

        if (response.ret !== 'OK')
            throw new Error(`Failed to set zones: ${response.ret}`);
    }
}