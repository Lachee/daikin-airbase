import type {DaikinResponse, API} from "../API";

export type NetworkSettingResponse = DaikinResponse & {
    auto_ip: number
    auto_dns: number
    ipaddr: string
    netmask: string
    gateway: string
    dns1: string
    dns2: string
    use_proxy: number
    proxy: string
    proxy_port: number
}

export const get_wifi_setting = (http : API) =>
    http.request('/common/get_network_setting') as Promise<NetworkSettingResponse>;