import { useEventListener, useMotionAllowed } from '../hooks'
import { useCallback } from 'react'

export default function useParallax(
  items: HTMLElement[],
  flag: boolean = true,
) {
  const isMotionAllowed = useMotionAllowed()

  const onScroll = useCallback(
    (event: GlobalEventHandlersEventMap['scroll']) => {
      if (!flag || !isMotionAllowed) {
        return
      }

      items.forEach((item, index) => {
        if (!item) {
          return
        }

        const box = item.getBoundingClientRect()

        requestAnimationFrame(() => {
          item.style.transform = `translate3d(0, ${(box.top / window.innerHeight) * 100 * (1 + index / 500)}%, 0)`
        })
      })
    },
    [items, flag, isMotionAllowed],
  )

  useEventListener('scroll', onScroll, { passive: true })
}
