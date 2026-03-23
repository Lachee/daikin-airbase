import type { DaikinResponse, Client } from "../Client";

export type QuickTimerResponse = DaikinResponse & {
  t1_ena: string,
  t1_pow: string,
  t1_time: string,
  t2_ena: string,
  t2_pow: string,
  t2_time: string
}

export const get_quick_timer = (http: Client) =>
  http.request('/aircon/get_quick_timer') as Promise<QuickTimerResponse>;
