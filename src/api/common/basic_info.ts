import type { DaikinResponse, Client } from "../Client";

export type BasicInfoResponse = DaikinResponse & {
  type: 'aircon',
  reg: 'string',
  dst: number
  ver: 'string'
  rev: 'string'
  pow: number,
  err: number,
  location: number,
  name: 'string' // %44%61%69%6b%69%6e%41%50%35%30%38%39%35,
  icon: number,
  method: 'polling',
  port: number
  id: 'string',
  pw: 'string',
  lpw_flag: number,
  adp_kind: number,
  led: number,
  en_setzone: number
  mac: string
  adp_mode: 'run',
  ssid: 'string'
  err_type: string,
  err_code: number,
  en_ch: number,
  holiday: number,
  en_hol: number,
  sync_time: number
}

export const basic_info = (http: Client) =>
  http.request('/common/basic_info') as Promise<BasicInfoResponse>;
