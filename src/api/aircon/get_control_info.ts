import type {DaikinResponse, API} from "../API";

export type ControlInfoResponse = DaikinResponse & {
    pow: number,
    mode: number,
    operate: number,
    bk_auto: number,
    stemp: number,
    dt1: number,
    dt2: number,
    f_rate: number,
    dfr1: number,
    dfr2: number,
    f_airside: number,
    airside1: number,
    airside2: number,
    f_auto: number,
    auto1: number,
    auto2: number,
    f_dir: number,
    dfd1: number,
    dfd2: number,
    filter_sign_info: number,
    cent: number,
    en_cent: number,
    remo: number
}

export const get_control_info = (http : API) =>
    http.request('/aircon/get_control_info') as Promise<ControlInfoResponse>;


