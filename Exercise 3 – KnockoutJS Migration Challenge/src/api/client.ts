// ---------------------------------------------------------------------------
// Tiny "API client" for the mock backend.
//
// The real app talked to `GlobalValues.WebApiUrl + 'Jobs/...'` via jQuery
// AJAX, wrapping every response in a C# `Result { Error, Message, Data }`.
// We keep that same envelope so that switching to the real API later is a
// drop-in change — see api/jobsApi.ts.
// ---------------------------------------------------------------------------

/** The response envelope every Northvale endpoint returns. */
export interface ApiResult<T> {
  error: number; // 0 = success, -1 = technical error, -2 = referenced elsewhere
  message: string;
  data: T;
}

/** Pretend the network took a moment, so spinners are visible in the demo. */
export function simulateLatency(ms = 400): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Wrap a value in a success envelope (Error = 0). */
export function ok<T>(data: T, message = "OK"): ApiResult<T> {
  return { error: 0, message, data };
}
