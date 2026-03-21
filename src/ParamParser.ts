export type Params = Record<string, number|string>;

export function parse(str : string) : Params {
    const result : Params = {};
    const parts = str.split(',');
    for (const part of parts) {
        const [key, value] = part.split('=');
        if (key === undefined) continue;

        const maybeNumber = Number(value);
        if (Number.isNaN(maybeNumber)) {
            result[key] = decodeURIComponent(`${value}`)
        } else {
            result[key] = maybeNumber;
        }
    }
    return result;
}

export function stringify(obj : Params) : string {
    return "";
}