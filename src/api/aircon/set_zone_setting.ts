import type { DaikinResponse, Client } from "../Client";

export type ZoneSettingRequestParam = {
  zone_name: string
  zone_onoff: string
  lztemp_c?: string
  lztemp_h?: string
}

export const set_zone_setting = (http: Client, params: ZoneSettingRequestParam) =>
  http.request('/aircon/set_zone_setting', params) as Promise<DaikinResponse>;

