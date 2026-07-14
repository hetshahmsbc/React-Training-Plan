const BASE_URL = "https://fakestoreapi.com";

// Generic GET request. <T> = "Whatever type the caller expects back".
export async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`);

  // fetch() does NOT throw on 404/500 — we must check .ok ourselves.
  if (!response.ok) {
    throw new Error(`Request failed (${response.status}) while loading "${path}"`);
  }

  return response.json() as Promise<T>;
}
