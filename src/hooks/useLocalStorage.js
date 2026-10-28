import { useEffect, useState } from 'react'

// useState that survives a refresh. Storage can be unavailable (private mode,
// blocked site data), so every access falls back to in-memory state.
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key)
      return stored === null ? initialValue : JSON.parse(stored)
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // ignore: the app still works, it just won't remember
    }
  }, [key, value])

  return [value, setValue]
}
