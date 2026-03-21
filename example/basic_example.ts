import {DaikinClient} from "../src";

const USE_DISCOVERY = false;
const FALLBACK_HOST = "10.0.30.182";

async function createClient() {
    if (USE_DISCOVERY) {
        const devices = await DaikinClient.discover();
        if (devices.length > 0 && devices[0]) {
            const device = devices[0];
            return new DaikinClient({device});
        }
    }

    return new DaikinClient({
        host: FALLBACK_HOST
    });
}

(async () => {
    const client = await createClient();

    await client.zones.setZone('Bathroom', true);
    const state = client.zones.getCachedZone('Bathroom');
    console.log(state);
})();
