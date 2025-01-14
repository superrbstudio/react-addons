export default function scrollToHash(hash: string) {
  const element = document.getElementById(hash)

  if (!element) {
    return false
  }

  let top = window.scrollY + element.getBoundingClientRect().top - 85
  window.scrollTo({ top, behavior: 'auto' })
  history.pushState({}, '', `#${hash}`)
}
