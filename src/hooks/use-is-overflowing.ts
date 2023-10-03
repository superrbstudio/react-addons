import { MutableRefObject } from 'react'

const useIsOverflowing = ({ current }: MutableRefObject<HTMLElement>) =>
  current &&
  (current.scrollWidth > current.clientWidth ||
    current.scrollHeight > current.clientHeight)

export default useIsOverflowing
