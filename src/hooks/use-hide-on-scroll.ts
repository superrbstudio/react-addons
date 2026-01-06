import { useCallback, useEffect, useState } from 'react'
import useEventListener from './use-event-listener'

export default function useHideOnScroll(
  hiddenOnLoad: boolean = false,
): boolean {
  const [hidden, setHidden] = useState<boolean>(hiddenOnLoad)

  const handleScroll = useCallback(() => {
    const previousY = window.scrollY

    setTimeout(() => {
      const y = window.scrollY

      if (y <= 50) {
        setHidden(false)
        return
      }

      if (y > previousY + 10) {
        setHidden(true)
      }

      if (y < previousY - 10) {
        setHidden(false)
      }
    }, 100)
  }, [setHidden])

  const handleLoad = useCallback(() => {
    if (window.scrollY > 0) {
      setHidden(true)
    }
  }, [setHidden])

  useEffect(() => {
    handleScroll()
  }, [])

  useEventListener('scroll', handleScroll, { passive: true })

  useEventListener('resize', handleLoad, { passive: true })

  useEventListener('popstate', handleLoad, { passive: true })

  useEventListener('pageshow', handleLoad, { passive: true })

  return hidden
}
