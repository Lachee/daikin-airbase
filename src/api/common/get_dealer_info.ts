import type { DaikinResponse, Client } from "../Client";

export type DealerInfoResponse = DaikinResponse & {
  dealer_name: string
  installer: string
  contactNumber: string
}

export const get_dealer_info = (http: Client) =>
  http.request('/common/get_dealer_info') as Promise<DealerInfoResponse>;
