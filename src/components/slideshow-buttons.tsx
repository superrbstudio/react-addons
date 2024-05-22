import { FC } from 'react'
import Button, { ButtonProps } from './button'
import { Slideshow } from '@/hooks/use-slideshow'

const SlideshowButtons = ({
  slideshow: { currentSlide, goTo, slideshowRef, atStart, atEnd },
  ButtonComponent = Button,
}: {
  slideshow: Slideshow
  ButtonComponent?: FC<ButtonProps>
}): JSX.Element => {
  return (
    <nav className="slideshow-buttons">
      <ButtonComponent
        label="Previous slide"
        onClick={() => goTo(currentSlide - 1)}
        disabled={atStart}
        aria-controls={
          slideshowRef.current?.getAttribute('id') as string | undefined
        }
      />
      <ButtonComponent
        label="Next slide"
        onClick={() => goTo(currentSlide + 1)}
        disabled={atEnd}
        aria-controls={
          slideshowRef.current?.getAttribute('id') as string | undefined
        }
      />
    </nav>
  )
}

export default SlideshowButtons
