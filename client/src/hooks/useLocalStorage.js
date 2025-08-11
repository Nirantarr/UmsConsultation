import { useState, useEffect, useCallback } from 'react';

// A constant for our custom event's name to avoid magic strings.
const CUSTOM_STORAGE_EVENT = 'custom-local-storage-event';

function useLocalStorage(key, initialValue) {
  const readValue = useCallback(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key “${key}”:`, error);
      return initialValue;
    }
  }, [key, initialValue]);

  const [storedValue, setStoredValue] = useState(readValue);

  const setValue = useCallback((value) => {
    if (typeof window === 'undefined') {
      console.warn(`Tried to set localStorage key “${key}” even though window is not defined`);
      return;
    }
    try {
      const newValue = value instanceof Function ? value(storedValue) : value;
      window.localStorage.setItem(key, JSON.stringify(newValue));
      setStoredValue(newValue);
      // Dispatch a custom event to notify components in the SAME tab.
      window.dispatchEvent(new CustomEvent(CUSTOM_STORAGE_EVENT, {
        detail: { key: key } 
      }));
    } catch (error) {
      console.warn(`Error setting localStorage key “${key}”:`, error);
    }
  }, [key, storedValue]); // `storedValue` is a dependency for the function-based setter

  // useEffect to listen for changes.
  useEffect(() => {
    // Handler for the custom event (same-tab updates).
    const handleCustomEvent = (event) => {
      if (event.detail.key === key) {
        setStoredValue(readValue());
      }
    };
    
    // ★★★ THE MODIFICATION ★★★
    // Handler for the standard 'storage' event (cross-tab updates).
    const handleStorageEvent = (event) => {
      // The 'storage' event is fired only for changes in other tabs.
      // event.key will be the key that was changed.
      if (event.key === key) {
        setStoredValue(readValue());
      }
    };

    // Add listener for our custom event.
    window.addEventListener(CUSTOM_STORAGE_EVENT, handleCustomEvent);
    // Add listener for the browser's standard storage event.
    window.addEventListener('storage', handleStorageEvent);

    // Cleanup: Remove both listeners when the component unmounts.
    return () => {
      window.removeEventListener(CUSTOM_STORAGE_EVENT, handleCustomEvent);
      window.removeEventListener('storage', handleStorageEvent);
    };
  }, [key, readValue]);

  return [storedValue, setValue];
}

export default useLocalStorage;

