import { useCallback, useEffect, useState } from "react"

export type Status = "idle" | "pending" | "success" | "error"

interface ReturnType<T, E = string> {
  execute: (...args: any) => Promise<void> // eslint-disable-line @typescript-eslint/no-explicit-any
  status: Status
  value: T | null
  error: E | null
}

// Hook
const useAsync = <T, E = string>(
  asyncFunction: (...args: any[]) => Promise<T>, // eslint-disable-line @typescript-eslint/no-explicit-any
  immediate = false,
  dependencies: any[] = [] // eslint-disable-line @typescript-eslint/no-explicit-any
): ReturnType<T, E> => {
  const [status, setStatus] = useState<Status>("idle")
  const [value, setValue] = useState<T | null>(null)
  const [error, setError] = useState<E | null>(null)

  useEffect(() => {
    setStatus("idle")
    setValue(null)
    setError(null)
  }, dependencies)

  // The execute function wraps asyncFunction and
  // handles setting state for pending, value, and error.
  // useCallback ensures the below useEffect is not called
  // on every render, but only if asyncFunction changes.
  const execute = useCallback(
    async (...args: any[]) => {
      setStatus("pending")
      setValue(null)
      setError(null)

      try {
        const response = await asyncFunction(...args)
        setValue(response)
        setStatus("success")
      } catch (err: any) {
        setError(err.message)
        setStatus("error")
      }
    },
    [asyncFunction]
  )

  // Call execute if we want to fire it right away.
  // Otherwise execute can be called later, such as
  // in an onClick handler.
  useEffect(() => {
    if (immediate) {
      void execute()
    }
  }, [execute, immediate])

  return { execute, status, value, error }
}

export default useAsync
