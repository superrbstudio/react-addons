import { useEffect } from 'react'

function useLockBodyScroll(toggle: boolean): void {
  useEffect(() => {
    document.body.style.overflow = toggle ? 'hidden' : 'unset'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [toggle])
}

export default useLockBodyScroll
