import { MutableRefObject, useCallback, useEffect, useState } from 'react'
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

export const isHorizontal = (element: SlideshowElement): boolean => {
  return window.getComputedStyle(element).scrollSnapType.startsWith('x')
}

export const isCentered = (element: SlideshowElement): boolean => {
  return (
    window.getComputedStyle(element.firstElementChild as Element)
      ?.scrollSnapAlign === 'center'
  )
}

export const getScrollProgress = (target: SlideshowElement) => {
  if (!target || target.scrollWidth === target.clientWidth) {
    return -1
  }

  return target.scrollLeft / (target.scrollWidth - target.clientWidth)
}

export const getCurrentSlideIndex = (
  element: SlideshowElement,
  currentIndex: number,
): number => {
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
    element.scrollLeft > element.previousScroll ? 'right' : 'left'
  const offset =25 
  let gap = parseFloat(window.getComputedStyle(element).gap) || 0
  if (isNaN(gap)) {
    gap = 0
  }

  const containerEdge =
    element.getBoundingClientRect()[horizontal ? 'left' : 'top']

  let newIndex = currentIndex
  let i = 0
  for (const child of element.children) {
    const edge =
      child.getBoundingClientRect()[horizontal ? 'left' : 'top'] - containerEdge

    if (centered) {
      const threshold = horizontal
        ? element.clientWidth / 2
        : element.clientHeight / 2

      if (edge >= 0 && edge < threshold) {
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

const useSlideshow = (
  slideshow: MutableRefObject<SlideshowElement>,
): Slideshow => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [progress, setProgress] = useState(-1)
  const [ready, setReady] = useState<boolean>(false)

  const update = useCallback(() => {
    if (!slideshow.current) {
      return
    }

    setCurrentSlide((current) =>
      getCurrentSlideIndex(slideshow.current, current),
    )
    setProgress(getScrollProgress(slideshow.current))
  }, [setCurrentSlide, slideshow])

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
  }, [slideshow, update])

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
    goTo: (index: number) => {
      index = Math.min(
        slideshow.current?.children.length - 1,
        Math.max(0, index),
      )
      const newElement = slideshow.current?.children[index] as HTMLElement

      const scrollOpts: ScrollToOptions = {
        behavior: 'smooth',
      }

      if (isHorizontal(slideshow.current)) {
        if (isCentered(slideshow.current)) {
          scrollOpts.left = newElement?.offsetLeft + newElement?.clientWidth / 2
        } else {
          scrollOpts.left = newElement?.offsetLeft
        }
      } else {
        if (isCentered(slideshow.current)) {
          scrollOpts.top = newElement?.offsetTop + newElement?.clientHeight / 2
        } else {
          scrollOpts.top = newElement?.offsetTop
        }
      }

      slideshow.current?.scrollTo(scrollOpts)
    },
    atStart: progress <= 0 || progress === -1,
    atEnd: progress >= 1 || progress === -1,
  }
}

export default useSlideshow
