import { MutableRefObject, useEffect, useRef } from 'react'

type Target = Document | Window | Element

type EventMap<T extends Target> = T extends Window
  ? WindowEventHandlersEventMap & GlobalEventHandlersEventMap
  : T extends Document
  ? DocumentEventMap
  : GlobalEventHandlersEventMap

type EventName<T extends Target> = keyof EventMap<T>

type EventListener<T extends Target, E extends EventName<T>> = (
  event: EventMap<T>[E],
) => void | boolean

// Hook
const useEventListener = <T extends Target, E extends EventName<T>>(
  eventName: E,
  handler: EventListener<T, E>,
  options: boolean | AddEventListenerOptions = {},
  element?: T,
  flag: boolean = true,
) => {
  // Create a ref that stores handler
  const savedHandler = useRef<EventListener<T, E>>() as MutableRefObject<
    EventListener<T, E>
  >
  const elementRef = useRef<T>() as MutableRefObject<T>

  useEffect(() => {
    elementRef.current = element || (window as Window as T)
  }, [element])

  // Update ref.current value if handler changes.
  // This allows our effect below to always get latest handler ...
  // ... without us needing to pass it in effect deps array ...
  // ... and potentially cause effect to re-run every render.
  useEffect(() => {
    savedHandler.current = handler
  }, [handler])

  useEffect(
    () => {
      // Make sure element supports addEventListener
      // On
      const isSupported =
        elementRef.current && elementRef.current.addEventListener
      if (!isSupported) return

      // Create event listener that calls handler function stored in ref
      const eventListener: EventListener<T, E> = (event) =>
        savedHandler.current(event)

      if (flag) {
        // Add event listener
        elementRef.current.addEventListener(
          eventName as string,
          eventListener as EventListenerOrEventListenerObject,
          options,
        )
      } else {
        elementRef.current.removeEventListener(
          eventName as string,
          eventListener as EventListenerOrEventListenerObject,
        )
      }

      // Remove event listener on cleanup
      return () => {
        elementRef.current.removeEventListener(
          eventName as string,
          eventListener as EventListenerOrEventListenerObject,
        )
      }
    },
    [
      eventName,
      handler,
      options,
      element,
      flag,
    ], // Re-run if eventName or element changes
  )
}

export default useEventListener
