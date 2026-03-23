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

export enum ControlMode {
  Fan,
  Hot,
  Cool,
  Auto,
  Dry = 7
}

export enum FanSpeed {
  Low    = 1,
  Medium = 3,
  High   = 5,
}

export enum Status {
  Stopped   = 0,
  Operating = 1,
  Idle      = 2
}

export enum RemoteType {
  None,
  Wired,
  Wireless
}

export type ControlInfo = {
  mode: ControlMode,              // mode
  fanSpeed: FanSpeed,             // f_rate
  fanAuto: boolean,               // f_auto
  fanAirside: boolean,            // f_airside
  targetTemperature: number,      // stemp
  sensorTemperatures: number[],   //dt1, dt2, ...
  power: boolean,                 // pow
  status: Status,                 // operate
  swinging: boolean,              // f_dir
  isFilterDirty: boolean,         // filter_sign_info
  isCentrallyControlled: boolean, // cent
  remoteControlType: RemoteType,  // remo
}