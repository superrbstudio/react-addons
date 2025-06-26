import { RefObject } from 'react'
import { useEventListener } from '../hooks'

const useEscape = (
  ref: RefObject<HTMLElement | null>,
  callback: () => void,
  opts = {
    requireFocus: true
  }
) => {
  useEventListener(
    'keydown',
    (event) => {
      if (
        (opts.requireFocus == false || ref.current?.contains(document.activeElement)) &&
        event.key === 'Escape'
      ) {
        event.preventDefault()
        callback()
      }
    },
    {},
    typeof document !== 'undefined' ? document : undefined,
    ref.current !== undefined && typeof document !== 'undefined',
  )
}

export default useEscape
