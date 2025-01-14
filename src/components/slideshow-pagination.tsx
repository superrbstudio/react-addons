import { Slideshow } from '@/hooks/use-slideshow'

export default function SlideshowPagination({
  slideshow: { currentSlide, slideCount, goTo },
}: {
  slideshow: Slideshow
}) {
  return (
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
}
