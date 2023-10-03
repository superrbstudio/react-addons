export let animator: (element: HTMLElement) => void
export let observer: IntersectionObserver

if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
  const onIntersect = (entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && entry.intersectionRatio > 0) {
        entry.target.classList.add('animated')

        return
      }

      entry.target.classList.remove('animated')
    })
  }

  observer = new IntersectionObserver(onIntersect, {
    rootMargin: '0px 0px',
    threshold: [0, 0.25, 0.5, 0.75, 1],
  })

  animator = (element) => {
    if (!element || typeof element !== 'object') {
      return
    }

    observer.observe(element)
    element.classList.add('animate-on-scroll')
  }
}
