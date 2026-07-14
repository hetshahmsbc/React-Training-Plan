import { useEffect, useState } from "react";

// Returns a copy of `value` that only updates after `delay` ms of silence.
// Perfect for search: we filter after the user pauses, not on every key press.
export function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    // If `value` changes before the timer fires, cancel it and start over.
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
