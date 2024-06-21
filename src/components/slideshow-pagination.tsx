import { Slideshow } from '@/hooks/use-slideshow'

const SlideshowPagination = ({
  slideshow: { currentSlide, slideCount, goTo },
}: {
  slideshow: Slideshow
}) => (
  <nav className="slideshow-pagination">
    {Array.from({ length: slideCount }, (_, i) => (
      <button
        key={i}
        className="slideshow-pagination__button"
        aria-current={currentSlide === i ? 'true' : 'false'}
        onClick={() => goTo(i)}
      >
        <span>Slide {i + 1}</span>
      </button>
    ))}
  </nav>
)

export default SlideshowPagination
