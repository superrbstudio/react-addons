import { useEffect } from 'react'

export default function useLockBodyScroll(toggle: boolean): void {
  useEffect(() => {
    document.body.style.overflow = toggle ? 'hidden' : 'unset'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [toggle])
}
