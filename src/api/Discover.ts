import { deserialize } from "../ParamParser";
import dgram from 'node:dgram';
import type { BasicInfoResponse } from "./common/basic_info";

export type DiscoveredDevice = BasicInfoResponse & {
  discoveredAddress: string,
  discoveredPort: number,
}

const DISCOVERY_PORT = 30050;
const DISCOVERY_ADDRESS = '255.255.255.255';

export function discover(timeoutMs = 3000): Promise<DiscoveredDevice[]> {
  return new Promise<DiscoveredDevice[]>((resolve, reject) => {
    const availableUnits = new Map<string, DiscoveredDevice>();

    const socket = dgram.createSocket('udp4');
    const payload = Buffer.from('DAIKIN_UDP/common/basic_info', 'utf8');

    const finish = () => {
      socket.close();
      resolve([ ...availableUnits.values() ]);
    };

    socket.once('error', (err) => {
      socket.close();
      reject(err);
    });

    socket.on('message', (msg, rinfo) => {
      const raw = msg.toString('utf8');
      const info = deserialize(raw.split(',')) as BasicInfoResponse;
      const key = `${info.mac || info.id || rinfo.address}`;
      availableUnits.set(key, {
        discoveredAddress: rinfo.address,
        discoveredPort:    rinfo.port,
        ...info
      });
    });

    socket.bind(0, '0.0.0.0', () => {
      try {
        socket.setBroadcast(true);
        socket.send(payload, DISCOVERY_PORT, DISCOVERY_ADDRESS, (err) => {
          if (err) {
            socket.close();
            reject(err);
            return;
          }

          setTimeout(finish, timeoutMs);
        });
      } catch (err) {
        socket.close();
        reject(err);
      }
    });
  });
}