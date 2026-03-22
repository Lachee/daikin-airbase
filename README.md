# TypeScript Daikin Airbase Library
This library is used to communicate with Daikin Airbase devices.

## Supported Devices

- Wireless LAN connecting Adaptor for Ducted Split Systems
  - 🇦🇺 `BRP15B61`

## Supported Features
The following features have been tested
- Get/Set Temperature
- Get/Set Fan Speed
- Get/Set Power
- Get/Set Mode
- Get/Set Zones On/Off

## Not Yet Implemented
The following features are not yet implemented. 
A lot of these are not supported by my particular device. Some i just didn't need to implement.

**Pull Requests are welcome!**
- Get/Set Humidity
- Get/Set Zones Temperature
- Get/Set Zones Humidity
- Timers

## Usage
There are a collection of examples in the `examples` folder. As a very basic example:
```typescript
import {DaikinClient} from "../src";
const client = new DaikinClient({ host: EXAMPLE_HOST });
await client.setTargetTemprature(24);
```

## Development
All contributions are welcome! Please make sure everything is tested on your own device before submitting a pull request.

There is no real strict style guide, but please try to follow the existing code.
- Raw endpoints should be in the `src/api/` and the client should wrap and map them to nicer objects in `src/`
- A list of all available endpoints can be found in [ENDPOINTS.md](https://github.com/Lachee/daikin-airbase/blob/main/ENDPOINTS.md). 
  - These were extracted from the [App's](https://play.google.com/store/apps/details?id=au.com.daikin.airbase&hl=en_AU) strings.