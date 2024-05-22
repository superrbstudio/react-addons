import { MutableRefObject, useEffect, useState } from 'react'

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

  const direction =
    element.scrollLeft > element.previousScroll ? 'right' : 'left'
  let gap = parseFloat(window.getComputedStyle(element).gap) || 0
  if (isNaN(gap)) {
    gap = 0
  }

  const horizontal = window
    .getComputedStyle(element)
    .scrollSnapType.startsWith('x')
  const centered =
    window.getComputedStyle(element.firstElementChild as Element)
      ?.scrollSnapAlign === 'center'
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

  useEffect(() => {
    if (slideshow.current) {
      setCurrentSlide((current) =>
        getCurrentSlideIndex(slideshow.current, current),
      )

      slideshow.current.addEventListener('scroll', () => {
        setCurrentSlide((current) =>
          getCurrentSlideIndex(slideshow.current, current),
        )
      })
      slideshow.current.addEventListener('resize', () =>
        setCurrentSlide((current) =>
          getCurrentSlideIndex(slideshow.current, current),
        ),
      )
    }
  }, [slideshow])

  if (!slideshow.current) {
    return {
      slideshowRef: slideshow,
      currentSlide: 0,
      slideCount: 0,
      goTo: () => {},
      atStart: true,
      atEnd: true,
    }
  }

  return {
    slideshowRef: slideshow,
    currentSlide,
    slideCount: slideshow.current?.children.length || 0,
    goTo: (index: number) => {
      slideshow.current?.children[index]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest',
      })
    },
    atStart: getScrollProgress(slideshow.current) <= 0,
    atEnd: getScrollProgress(slideshow.current) >= 1,
  }
}

export default useSlideshow
