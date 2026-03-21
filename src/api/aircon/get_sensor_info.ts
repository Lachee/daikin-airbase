import type {DaikinResponse, API} from "../API";

export type SensorInfoResponse = DaikinResponse & {
    err: number,
    htemp: number,
    otemp: number | '-'
}

export const get_sensor_info = (http : API) =>
    http.request('/aircon/get_sensor_info') as Promise<SensorInfoResponse>;
