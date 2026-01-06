import { RefObject, useRef } from 'react'
import useEventListener from './use-event-listener'

const useEscape = (
  ref: RefObject<HTMLElement | null>,
  callback: () => void,
  opts = {
    requireFocus: true,
  },
) => {
  const documentRef = useRef<Document>(
    typeof document !== 'undefined' ? document : null,
  ) as RefObject<Document>

  useEventListener(
    'keydown',
    (event) => {
      if (
        (opts.requireFocus == false ||
          ref.current?.contains(document.activeElement)) &&
        event.key === 'Escape'
      ) {
        event.preventDefault()
        callback()
      }
    },
    undefined,
    documentRef,
  )
}

export default useEscape
