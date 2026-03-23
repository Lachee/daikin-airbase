import { type Params, deserialize, serialize } from "../ParamParser";
import http from "node:http";

export type DaikinResponse = {
  ret: 'OK'
}

export type DaikinError = DaikinResponse & {
  ret: string
  msg: string
}

export class Client {
  public readonly host: string;

  constructor(host: string) {
    this.host = host;
  }

  async request(endpoint: string, parameters?: Record<string, string | number | undefined | null>): Promise<Params> {
    const body = await new Promise<string>((resolve, reject) => {
      const url = new URL(`/skyfi${endpoint}`, `http://${this.host}/`)

      const serialized = parameters ? serialize(parameters) : [];
      const search = serialized.length > 0 ? `?${serialized.join('&')}` : '';
      const req = http.request(
        {
          host:    url.hostname,
          port:    url.port,
          path:    url.pathname + search, // important
          method:  "GET",
          headers: {
            Accept:     '*/*',
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

    return deserialize(body.split(','));
  }

}