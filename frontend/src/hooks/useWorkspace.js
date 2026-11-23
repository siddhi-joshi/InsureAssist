import { useCallback, useEffect, useState } from 'react'
import { api } from '../lib/api'

export function useWorkspace() {
  const [data, setData] = useState(null)
  const [health, setHealth] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const refresh = useCallback(async () => {
    setError('')
    try {
      const [workspace, status] = await Promise.all([api('/api/dashboard'), api('/api/health')])
      setData(workspace)
      setHealth(status)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])
  return { data, health, loading, error, refresh }
}
