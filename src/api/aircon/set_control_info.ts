import type {DaikinResponse, API} from "../API";

export type ControlInfoRequestParam = {
    f_airside: number
    f_auto: number
    f_dir: number
    f_rate: number
    /** Seemingly unused */
    lpw?: ''
    mode: number
    pow: number
    /** Humidity set, unused in my model */
    shum?: number | '--'
    stemp: number
}
export const set_control_info = (http : API, params : ControlInfoRequestParam) =>
    http.request('/aircon/set_control_info', params) as Promise<DaikinResponse>;

