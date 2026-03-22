import {DaikinClient} from "../src";

(async () => {
    // Discover a list of devices on the network. The default scan time is 3 seconds.
    console.log("Discovering devices...");
    const devices = await DaikinClient.discover();
    if (devices.length == 0 || !devices[0]) {
        console.error("No devices found");
        return;
    }
    console.log("Found devices:", devices);


    // Filter the device you would normally want. Ducted houses are likely to only have one.
    const client = new DaikinClient({ device: devices[0] });
    const info = await client.getBasicInfo();
    console.log('Basic Info for', info.name);
    console.log(info);
})();
