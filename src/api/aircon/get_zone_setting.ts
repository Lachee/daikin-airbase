import type {DaikinResponse, API} from "../API";

export type ZoneSettingResponse = DaikinResponse & {
    zone_name: string
    zone_onoff: string;
}

export const get_zone_settings = (http : API) =>
    http.request('/aircon/get_zone_setting') as Promise<ZoneSettingResponse>;


