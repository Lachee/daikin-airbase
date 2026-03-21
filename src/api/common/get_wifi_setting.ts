import type {DaikinResponse, API} from "../API";

export type WifiSettingResponse = DaikinResponse & {
    ssid: string
    security: string
    key: string
    link: number
}

export const get_wifi_setting = (http : API) =>
    http.request('/common/get_wifi_setting') as Promise<WifiSettingResponse>;