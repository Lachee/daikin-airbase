import {DaikinClient, Client} from "../src";

const EXAMPLE_HOST = "10.0.30.182";
const EXAMPLE_TEMP = 22.2;

(async () => {
    // Filter the device you would normally want. Ducted houses are likely to only have one.
    const client = new DaikinClient({ host: EXAMPLE_HOST });

    // Check the state of the system
    const target = await client.getTargetTemperature()
    console.log("Target temperature is ", `${target}℃`);
    console.log(`The new target temprature will be ${EXAMPLE_TEMP}℃`)

    await client.setTargetTemperature(EXAMPLE_TEMP);
    console.log("- done, reading back the new temperature:");
    console.log(await client.getTargetTemperature());
})();
