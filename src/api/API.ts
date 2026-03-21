import {type Params, parse} from "../ParamParser";
import http from "node:http";

export type DaikinResponse = {
    ret: 'OK'
}

type DaikinError = DaikinResponse & {
    ret: string
    msg: string
}

export class API {
    public readonly host : string;

    constructor(host : string) {
        this.host = host;
    }

    async request(endpoint: string, parameters? : Record<string, string>) : Promise<Params> {
        const body = await new Promise<string>((resolve, reject) => {
            const url = new URL(`/skyfi${endpoint}`, `http://${this.host}/`)
            const queries = [];
            if (parameters) {
                for (const key in parameters) {
                    // It specifically needs space to be encoded as %20, so we will manually force the URI encoding.
                    // instead of the more modern browser + for spaces.
                    const value = encodeURIComponent(parameters[key] || '');
                    queries.push(`${key}=${value}`);
                }
            }

            const search = queries.length > 0 ? `?${queries.join('&')}` : '';
            const req = http.request(
                {
                    host: url.hostname,
                    port: url.port,
                    path: url.pathname + search, // important
                    method: "GET",
                    headers: {
                        Accept: '*/*',
                        Connection: 'close',
                    }
                },
                (res) => {
                    let data = '';
                    res.setEncoding('utf8');
                    res.on('data', (c) => (data += c));
                    res.on('end', () => resolve(data));
                }
            )

            req.on('error', reject);
            req.end();
        });

        return parse(body);
    }

}