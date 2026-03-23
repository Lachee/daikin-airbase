import type { DaikinResponse, Client } from "../Client";

export type ZoneSettingResponse = DaikinResponse & {
  zone_name: string
  zone_onoff: string
  lztemp_c?: string
  lztemp_h?: string
}

export const get_zone_settings = (http: Client) =>
  http.request('/aircon/get_zone_setting') as Promise<ZoneSettingResponse>;


