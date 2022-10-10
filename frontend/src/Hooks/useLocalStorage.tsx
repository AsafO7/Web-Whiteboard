import { useEffect, useState } from 'react'

const PREFIX = 'whiteboard-'

export default function useLocalStorage(key: string, initialValue?: any) {
  const prefixedKey = PREFIX + key
  const [value, setValue] = useState(() => {
    const jsonValue = localStorage.getItem(prefixedKey)
    // We check if jsonValue != null because in some instances our jsonValue might be 0 and we only want to return null
    // When the value is null or undefined.
    if (jsonValue != null) return JSON.parse(jsonValue)
    // If we use the function version of our useState, we want to invoke it.
    if (typeof initialValue === 'function') {
      return initialValue()
    } else {
      return initialValue
    }
  })

  useEffect(() => {
    localStorage.setItem(prefixedKey, JSON.stringify(value))
  }, [prefixedKey, value])

  return [value, setValue]
}