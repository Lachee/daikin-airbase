import type { DaikinResponse, Client } from "../Client";

export type WifiSettingResponse = DaikinResponse & {
  ssid: string
  security: string
  key: string
  link: number
}

export const get_wifi_setting = (http: Client) =>
  http.request('/common/get_wifi_setting') as Promise<WifiSettingResponse>;