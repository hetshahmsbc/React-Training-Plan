import { useEffect, useState } from "react";

// The three things every data fetch needs to track.
interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

// Runs `fetcher` when the component mounts, and again whenever `deps` change.
export function useFetch<T>(fetcher: () => Promise<T>, deps: unknown[] = []): FetchState<T> {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    // `active` guards against setting state after the component unmounts
    // (or after deps change and a newer request started).
    let active = true;
    setState({ data: null, loading: true, error: null });

    fetcher()
      .then((data) => {
        if (active) setState({ data, loading: false, error: null });
      })
      .catch((err: unknown) => {
        if (active) {
          const message = err instanceof Error ? err.message : "Something went wrong";
          setState({ data: null, loading: false, error: message });
        }
      });

    // Cleanup runs before the next effect / on unmount.
    return () => {
      active = false;
    };
  }, deps);

  return state;
}
