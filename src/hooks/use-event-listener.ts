import { useEffect } from 'react'

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
export default function useEventListener<
  T extends Target,
  E extends EventName<T>,
>(
  eventName: E,
  handler: EventListener<T, E>,
  options: boolean | AddEventListenerOptions = {},
  element?: T | null,
  flag: boolean = true,
) {
  element = element || (window as Window as T)
  useEffect(() => {
    if (flag) {
      element?.addEventListener(
        eventName as string,
        handler as EventListenerOrEventListenerObject,
        options,
      )
    } else {
      element?.removeEventListener(
        eventName as string,
        handler as EventListenerOrEventListenerObject,
      )
    }

    return () => {
      element?.removeEventListener(
        eventName as string,
        handler as EventListenerOrEventListenerObject,
      )
    }
  }, [element, eventName, handler, options, flag])
}
