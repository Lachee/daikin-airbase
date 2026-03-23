import type { DaikinResponse, Client } from "../Client";

export type ModelInfoResponse = DaikinResponse & {
  model: string,
  type: string,
  humd: number,
  s_humd: number,
  en_zone: number,
  en_linear_zone: number,
  en_filter_sign: number,
  acled: number,
  land: number,
  elec: number,
  temp: number,
  m_dtct: number,
  ac_dst: string,
  dmnd: number,
  en_temp_setting: number,
  en_frate: number,
  en_fdir: number,
  en_rtemp_a: number,
  en_spmode: number,
  en_ipw_sep: number,
  en_scdltmr: number,
  en_mompow: number,
  en_patrol: number,
  en_airside: number,
  en_quick_timer: number,
  en_auto: number,
  en_dry: number,
  en_common_zone: number,
  cool_l: number,
  cool_h: number,
  heat_l: number,
  heat_h: number,
  frate_steps: number,
  en_frate_auto: number
}

export const get_model_info = (http: Client) =>
  http.request('/aircon/get_model_info') as Promise<ModelInfoResponse>;
