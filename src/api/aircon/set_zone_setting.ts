import type {DaikinResponse, API} from "../API";

export type ZoneSettingRequestParam = {
    zone_name : string,
    zone_onoff : string
}

export const set_zone_setting = (http : API, params : ZoneSettingRequestParam) =>
    http.request('/aircon/set_zone_setting', params) as Promise<DaikinResponse>;

