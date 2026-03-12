import { useEffect, useState, useCallback } from "react";

//handles localstorage persstance

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setStoredValue = useCallback(
    (newValue: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const valueToStore =
          newValue instanceof Function ? newValue(prev) : newValue;

        try {
          localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (err) {
          console.error("Failed to save to localStorage", err);
        }

        return valueToStore;
      });
    },
    [key],
  );

  useEffect(() => {
    const sync = (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        try {
          setValue(JSON.parse(e.newValue));
        } catch {
          /* ignore */
        }
      }
    };

    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, [key]);

  return [value, setStoredValue] as const;
}
