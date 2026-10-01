'use client'

import { useCallback, useEffect, useState, type DependencyList } from 'react'

type State<T> = { data: T | null; error: string | null; loading: boolean }

export function useAsync<T>(fn: () => Promise<T>, deps: DependencyList = []) {
  const [state, setState] = useState<State<T>>({ data: null, error: null, loading: true })
  const [tick, setTick] = useState(0)

  useEffect(() => {
    let cancelled = false
    setState((s) => ({ ...s, loading: true, error: null }))
    fn()
      .then((data) => !cancelled && setState({ data, error: null, loading: false }))
      .catch((e) => {
        if (cancelled) return
        setState({ data: null, error: e instanceof Error ? e.message : 'Something went wrong', loading: false })
      })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, tick])

  const reload = useCallback(() => setTick((t) => t + 1), [])
  return { ...state, reload }
}