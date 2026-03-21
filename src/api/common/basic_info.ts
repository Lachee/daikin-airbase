import type {DaikinResponse, API} from "../API";

export type BasicInfoResponse = DaikinResponse & {
    type:'aircon',
    reg: 'string',
    dst: number
    ver: 'string'
    rev: 'string'
    pow: number,
    err:number,
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
    err_code : number,
    en_ch: number,
    holiday: number,
    en_hol: number,
    sync_time: number
}

export const basic_info = (http : API) =>
    http.request('/common/basic_info') as Promise<BasicInfoResponse>;

export type BasicInfo = {
    type: 'aircon',
    region: string,
    version: string,
    name: string,
    method: 'polling',
    port: number,
    id: string,
    password: string,
    ssid: string,
    led: boolean,
    adp_mode: 'run',
    adp_kind: number,
}
export async function getBasicInfo(http : API) : Promise<BasicInfo> {
    const response = await basic_info(http);
    return {
        type: response.type,
        region: response.reg,
        version: response.ver,
        name: response.name,
        method: response.method,
        port: response.port,
        id: response.id,
        password: response.pw,
        ssid: response.ssid,
        led: response.led === 1,
        adp_mode: response.adp_mode,
        adp_kind: response.adp_kind,
    }
}