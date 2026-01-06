import { useEffect, useRef } from 'react'

import type { RefObject } from 'react'

import { useIsomorphicLayoutEffect } from 'usehooks-ts'

// MediaQueryList Event based useEventListener interface
export default function useEventListener<
  K extends keyof MediaQueryListEventMap,
>(
  eventName: K,
  handler: (event: MediaQueryListEventMap[K]) => void,
  options?: boolean | AddEventListenerOptions,
  element?: RefObject<MediaQueryList>,
  flag?: boolean,
): void

// Window Event based useEventListener interface
export default function useEventListener<K extends keyof WindowEventMap>(
  eventName: K,
  handler: (event: WindowEventMap[K]) => void,
  options?: boolean | AddEventListenerOptions,
  element?: undefined,
  flag?: boolean,
): void

// Element Event based useEventListener interface
export default function useEventListener<
  K extends keyof HTMLElementEventMap & keyof SVGElementEventMap,
  T extends Element = K extends keyof HTMLElementEventMap
    ? HTMLDivElement
    : SVGElement,
>(
  eventName: K,
  handler:
    | ((event: HTMLElementEventMap[K]) => void)
    | ((event: SVGElementEventMap[K]) => void),
  options?: boolean | AddEventListenerOptions,
  element?: RefObject<T>,
  flag?: boolean,
): void

// Document Event based useEventListener interface
export default function useEventListener<K extends keyof DocumentEventMap>(
  eventName: K,
  handler: (event: DocumentEventMap[K]) => void,
  options?: boolean | AddEventListenerOptions,
  element?: RefObject<Document>,
  flag?: boolean,
): void

export default function useEventListener<
  KW extends keyof WindowEventMap,
  KH extends keyof HTMLElementEventMap & keyof SVGElementEventMap,
  KM extends keyof MediaQueryListEventMap,
  T extends HTMLElement | SVGAElement | MediaQueryList = HTMLElement,
>(
  eventName: KW | KH | KM,
  handler: (
    event:
      | WindowEventMap[KW]
      | HTMLElementEventMap[KH]
      | SVGElementEventMap[KH]
      | MediaQueryListEventMap[KM]
      | Event,
  ) => void,
  options?: boolean | AddEventListenerOptions,
  element?: RefObject<T>,
  flag: boolean = true,
) {
  // Create a ref that stores handler
  const savedHandler = useRef<typeof handler>(handler)

  useIsomorphicLayoutEffect(() => {
    savedHandler.current = handler
  }, [handler])

  useEffect(() => {
    const targetElement = element?.current ?? window

    if (!(targetElement && targetElement.addEventListener)) return

    // Create event listener that calls handler function stored in ref
    const listener: typeof handler = (event) => {
      savedHandler.current(event)
    }

    if (flag) {
      targetElement.addEventListener(eventName, listener, options)
    } else {
      targetElement.removeEventListener(eventName, listener, options)
    }

    // Remove event listener on cleanup
    return () => {
      targetElement.removeEventListener(eventName, listener, options)
    }
  }, [eventName, element, options, flag])
}
