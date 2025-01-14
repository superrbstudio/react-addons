import { MutableRefObject } from 'react'

export default function useIsOverflowing({
  current,
}: MutableRefObject<HTMLElement>) {
  return (
    current &&
    (current.scrollWidth > current.clientWidth ||
      current.scrollHeight > current.clientHeight)
  )
}
