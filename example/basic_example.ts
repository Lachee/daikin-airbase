import {DaikinClient} from "../src";

const EXAMPLE_HOST = "10.0.30.182";

(async () => {
    // Filter the device you would normally want. Ducted houses are likely to only have one.
    const client = new DaikinClient({ host: EXAMPLE_HOST });
    const info = await client.getBasicInfo();
    console.log('Basic Info for', info.name);
    console.log(info);

    // Check the state of the system
    const target = await client.getTargetTemperature()
    console.log("Target temperature is ", `${target}℃`);

    // Check the state of a zone
    const zone = await client.zones.getZoneAt(0);
    console.log(`The '${zone.name}' is ${zone.isOn ? "on" : "off"}`);
    if (zone.temperature) console.log(`- It is set to ${zone.temperature}℃`)
})();
