import type { StateStorage } from "zustand/middleware";

function serialize(value: any): string {
  if (typeof value === "object" && value !== null) {
    return Object.entries(value)
      .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
      .join("&");
  }
  return encodeURIComponent(value);
}

function deserialize(serialized: string): any {
  const pairs = serialized.split("&");
  const result: Record<string, any> = {};
  for (const pair of pairs) {
    const [key, value] = pair.split("=");
    if (key && value) {
      result[key] = decodeURIComponent(value);
    }
  }
  return result;
}

export const hashStorage: StateStorage = {
  getItem: (key): string => {
    const searchParams = new URLSearchParams(window.location.hash.slice(1));
    const storedValue = searchParams.get(key);
    return storedValue ? deserialize(storedValue) : null;
  },
  setItem: (key, newValue): void => {
    const searchParams = new URLSearchParams(window.location.hash.slice(1));
    searchParams.set(key, serialize(newValue));
    window.location.hash = searchParams.toString();
  },
  removeItem: (key): void => {
    const searchParams = new URLSearchParams(window.location.hash.slice(1));
    searchParams.delete(key);
    window.location.hash = searchParams.toString();
  },
};
