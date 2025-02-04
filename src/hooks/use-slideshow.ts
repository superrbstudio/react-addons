import { MutableRefObject, useEffect, useState } from 'react'
import useEventListener from './use-event-listener'

export type SlideshowElement = HTMLElement & {
  previousScroll?: number
}

export type Slideshow = {
  slideshowRef: MutableRefObject<SlideshowElement>
  currentSlide: number
  slideCount: number
  goTo: (index: number) => void
  atStart: boolean
  atEnd: boolean
}

export function isHorizontal(element: SlideshowElement): boolean {
  return window.getComputedStyle(element).scrollSnapType.startsWith('x')
}

export function isCentered(element: SlideshowElement): boolean {
  return (
    window.getComputedStyle(element.firstElementChild as Element)
      ?.scrollSnapAlign === 'center'
  )
}

export function getScrollProgress(target: SlideshowElement) {
  if (!target || target.scrollWidth === target.clientWidth) {
    return -1
  }

  return target.scrollLeft / (target.scrollWidth - target.clientWidth)
}

export function getCurrentSlideIndex(
  element: SlideshowElement,
  currentIndex: number,
): number {
  if (!element) {
    return currentIndex
  }

  if (!element.previousScroll) {
    element.previousScroll = element.scrollLeft
    return currentIndex
  }

  const centered = isCentered(element)
  const horizontal = isHorizontal(element)
  const direction =
    element.scrollLeft > (element.previousScroll || 0) ? 'right' : 'left'
  const offset = 25
  let gap = parseFloat(window.getComputedStyle(element).gap) || 0
  if (isNaN(gap)) {
    gap = 0
  }

  let padding =
    parseFloat(
      window.getComputedStyle(element)[
        horizontal ? 'paddingLeft' : 'paddingTop'
      ],
    ) || 0
  if (isNaN(padding)) {
    padding = 0
  }
  const containerEdge =
    element.getBoundingClientRect()[horizontal ? 'left' : 'top'] + padding

  let newIndex = currentIndex
  let i = 0
  for (const child of element.children) {
    const edge =
      child.getBoundingClientRect()[horizontal ? 'left' : 'top'] - containerEdge

    if (centered) {
      const centeredEdge = edge - child.clientWidth / 2
      const threshold = horizontal
        ? element.clientWidth / 2
        : element.clientHeight / 2

      if (centeredEdge >= 0 && centeredEdge < threshold) {
        newIndex = i
        break
      }
    } else {
      const threshold =
        direction === 'right'
          ? (horizontal ? child.clientWidth : child.clientHeight) - gap - offset
          : 0 + gap + offset

      if (edge >= 0 - threshold) {
        newIndex = i
        break
      }
    }

    i++
  }

  element.previousScroll = element.scrollLeft

  return newIndex
}

export default function useSlideshow(
  slideshow: MutableRefObject<SlideshowElement>,
): Slideshow {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [progress, setProgress] = useState(-1)
  const [ready, setReady] = useState<boolean>(false)

  const update = () => {
    if (!slideshow.current) {
      return
    }

    setCurrentSlide((current) =>
      getCurrentSlideIndex(slideshow.current, current),
    )
    setProgress(getScrollProgress(slideshow.current))
  }

  useEventListener(
    'scroll',
    update,
    { passive: true },
    slideshow.current,
    !!slideshow.current && ready,
  )
  useEventListener(
    'resize',
    update,
    { passive: true },
    slideshow.current,
    !!slideshow.current && ready,
  )

  useEffect(() => {
    setReady(true)

    if (slideshow.current) {
      update()

      slideshow.current.setAttribute('role', 'region')
      slideshow.current.setAttribute('aria-label', 'carousel')
      slideshow.current.setAttribute('aria-live', 'polite')
    }
  }, [slideshow]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    ;[...slideshow.current?.children].forEach((child) =>
      child.setAttribute('aria-hidden', 'true'),
    )
    slideshow.current?.children[currentSlide].setAttribute(
      'aria-hidden',
      'false',
    )
  }, [currentSlide, slideshow])

  return {
    slideshowRef: slideshow,
    currentSlide,
    slideCount: slideshow.current?.children.length || 0,
    goTo(index: number) {
      index = Math.min(
        slideshow.current?.children.length - 1,
        Math.max(0, index),
      )
      const newElement = slideshow.current?.children[index] as HTMLElement

      newElement.scrollIntoView({
        behavior: 'smooth',
        block: isHorizontal(slideshow.current)
          ? 'nearest'
          : isCentered(slideshow.current)
            ? 'center'
            : 'start',
        inline: isHorizontal(slideshow.current)
          ? isCentered(slideshow.current)
            ? 'center'
            : 'start'
          : 'nearest',
      })

      // const scrollOpts: ScrollToOptions = {
      //   behavior: 'smooth',
      // }

      // if (isHorizontal(slideshow.current)) {
      //   if (isCentered(slideshow.current)) {
      //     scrollOpts.left = newElement?.offsetLeft + newElement?.clientWidth / 2
      //   } else {
      //     scrollOpts.left = newElement?.offsetLeft
      //   }
      // } else {
      //   if (isCentered(slideshow.current)) {
      //     scrollOpts.top = newElement?.offsetTop + newElement?.clientHeight / 2
      //   } else {
      //     scrollOpts.top = newElement?.offsetTop
      //   }
      // }

      // slideshow.current?.scrollTo(scrollOpts)
    },
    atStart: progress <= 0 || progress === -1,
    atEnd: progress >= 1 || progress === -1,
  }
}
