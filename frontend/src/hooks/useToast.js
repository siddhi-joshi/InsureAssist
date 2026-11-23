import { useEffect, useState } from 'react'

export function useToast(timeout = 3000) {
  const [message, setMessage] = useState('')
  useEffect(() => {
    if (!message) return undefined
    const timer = setTimeout(() => setMessage(''), timeout)
    return () => clearTimeout(timer)
  }, [message, timeout])
  return { message, showToast: setMessage }
}
