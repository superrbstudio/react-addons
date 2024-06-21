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
        return i
      }
    } else {
      const threshold =
        direction === 'right'
          ? (horizontal ? child.clientWidth : child.clientHeight) - gap
          : 0 + gap

      if (edge >= 0 - threshold) {
        return i
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
    }
  }, [slideshow, update])

  return {
    slideshowRef: slideshow,
    currentSlide,
    slideCount: slideshow.current?.children.length || 0,
    goTo: (index: number) => {
      const scrollOpts: ScrollIntoViewOptions = {
        behavior: 'smooth',
        block: 'start',
        inline: 'start',
      }

      if (isCentered(slideshow.current)) {
        scrollOpts.block = 'center'
        scrollOpts.inline = 'center'
      }

      if (isHorizontal(slideshow.current)) {
        scrollOpts.block = 'nearest'
      } else {
        scrollOpts.inline = 'nearest'
      }

      slideshow.current?.children[index]?.scrollIntoView(scrollOpts)
    },
    atStart: progress <= 0 || progress === -1,
    atEnd: progress >= 1 || progress === -1,
  }
}

export default useSlideshow
