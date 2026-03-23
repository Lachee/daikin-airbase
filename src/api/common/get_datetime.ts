import type { DaikinResponse, Client } from "../Client";

export type DateTimeResponse = DaikinResponse & {
  sta: string
  cur: number
  reg: string
  dst: number
  zone: number
}

export const get_datetime = (http: Client) =>
  http.request('/common/get_datetime') as Promise<DateTimeResponse>;