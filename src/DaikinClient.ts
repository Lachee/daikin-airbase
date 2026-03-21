import {
    API,
    discover,
    getBasicInfo,
} from './api';

import type {
    DiscoveredDevice
} from './api'
import {Zones} from "./Zones";

type DeviceOption =  {
    device : DiscoveredDevice;
}
type HostOption = {
    host : string;
}

export type DaikinClientOptions = (DeviceOption | HostOption) & {
    password?: string;
};

export class DaikinClient {

    private readonly options: DaikinClientOptions;

    public readonly api : API;
    public readonly zones : Zones;

    public constructor(options : DaikinClientOptions) {
        this.options = options;
        if ('host' in options) {
            this.api = new API(options.host);
        } else {
            this.api = new API(options.device.discoveredAddress);
        }
        this.zones = new Zones(this);
    }


    async getBasicInfo() {
        return await getBasicInfo(this.api);
    }

    static async discover(timeoutMs = 3000) {
        return discover(timeoutMs);
    }
}