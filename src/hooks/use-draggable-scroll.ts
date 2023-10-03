import {
  MouseEvent,
  MouseEventHandler,
  MutableRefObject,
  useEffect,
  useRef,
  useState,
} from 'react'
import { useDraggable } from 'react-use-draggable-scroll'
import { useEventListener, useIsInViewport } from '../hooks'

interface Events {
  onMouseDown: MouseEventHandler<HTMLElement>
}

const useDraggableScroll = (
  ref: MutableRefObject<HTMLElement>,
  { className, ...opts }: { className: string },
) => {
  const { isInViewport, setRef } = useIsInViewport(false)
  const { events } = useDraggable(ref, {
    ...opts,
    isMounted: ref.current !== undefined,
  })
  const [modifiedEvents, setModifiedEvents] = useState<Events>(events)
  const timer = useRef<NodeJS.Timeout>() as MutableRefObject<NodeJS.Timeout>
  const [dragging, setDragging] = useState<boolean>(false)

  const [shouldScroll, setShouldScroll] = useState<boolean>(false)

  setRef(ref.current)

  useEffect(() => {
    const shouldScroll =
      ref.current?.scrollWidth > ref.current?.clientWidth ||
      ref.current?.scrollHeight > ref.current?.clientHeight
    setShouldScroll(shouldScroll)

    const fn = shouldScroll ? 'add' : 'remove'
    ref.current?.classList[fn](`${className}--draggable`)
  }, [ref.current])

  const onDragStart = () => {
    setDragging(true)
    ref.current?.classList.add(`${className}--dragging`)
  }

  const onDragMove = () => {
    if (timer.current && dragging) {
      clearTimeout(timer.current)
    }
  }

  const onDragEnd = () => {
    setDragging(false)
    timer.current = setTimeout(() => {
      ref.current?.classList.remove(`${className}--dragging`)
    }, 100)
  }

  useEventListener(
    'mousemove',
    onDragMove,
    undefined,
    undefined,
    isInViewport && shouldScroll,
  )
  useEventListener(
    'mouseup',
    onDragEnd,
    undefined,
    undefined,
    isInViewport && shouldScroll,
  )

  useEffect(() => {
    if (!shouldScroll) {
      setModifiedEvents({
        onMouseDown: (event: MouseEvent) => event,
      })

      return
    }

    const originalOnMouseDown = events.onMouseDown

    setModifiedEvents({
      onMouseDown: (event) => {
        onDragStart()
        originalOnMouseDown(event)
      },
    } as Events)
  }, [ref, ref.current, setModifiedEvents, shouldScroll])

  return { events: modifiedEvents }
}

export default useDraggableScroll
