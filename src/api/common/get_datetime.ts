import type {DaikinResponse, API} from "../API";

export type DateTimeResponse = DaikinResponse & {
    sta: string
    cur: number
    reg: string
    dst: number
    zone: number
}

export const get_datetime = (http : API) =>
    http.request('/common/get_datetime') as Promise<DateTimeResponse>;