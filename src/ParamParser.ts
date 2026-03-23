export type Params = Record<string, number | string>;

export const int = (v: number) => Math.round(v);
export const bool = (v: boolean) => v ? 1 : 0;

/** Deserializes a request parameter string into a Params object */
export function deserialize(data: string[]): Params {
  const result: Params = {};
  for (const part of data) {
    const [ key, value ] = part.split('=');
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

/** Serializes request parameters into a string */
export function serialize(parameters: Record<string, string | number | undefined | null>): string[] {
  const queries = [];
  for (const key in parameters) {
    // It specifically needs space to be encoded as %20, so we will manually force the URI encoding.
    // instead of the more modern browser + for spaces.
    const value = parameters[key];
    if (value === undefined) continue;

    const encoded = encodeURIComponent(typeof value === 'string' ? value : value !== null ? `${int(value)}` : '');
    queries.push(`${key}=${encoded}`);
  }
  return queries;
}