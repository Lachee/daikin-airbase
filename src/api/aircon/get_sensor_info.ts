import type { DaikinResponse, Client } from "../Client";

export type SensorInfoResponse = DaikinResponse & {
  err: number,
  htemp: number,
  otemp: number | '-'
}

export const get_sensor_info = (http: Client) =>
  http.request('/aircon/get_sensor_info') as Promise<SensorInfoResponse>;
