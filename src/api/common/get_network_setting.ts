import type { DaikinResponse, Client } from "../Client";

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

export const getNetwork_setting = (http: Client) =>
  http.request('/common/get_network_setting') as Promise<NetworkSettingResponse>;