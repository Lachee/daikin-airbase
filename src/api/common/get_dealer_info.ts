import type {DaikinResponse, API} from "../API";

export type DealerInfoResponse = DaikinResponse & {
    dealer_name: string
    installer: string
    contactNumber: string
}

export const get_dealer_info = (http : API) =>
    http.request('/common/get_dealer_info') as Promise<DealerInfoResponse>;
