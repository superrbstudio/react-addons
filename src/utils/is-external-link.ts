export default function isExternalLink(url: string, forceExternal = false) {
  if (forceExternal) {
    return true
  }

  // Override is needed for relative or hash URLs, as they cannot be parsed
  if (url.startsWith('/') || url.startsWith('#')) {
    return false
  }

  // In SSR mode, treat everything as an external link
  if (!url || typeof window === 'undefined') {
    return true
  }

  let tmp: URL
  try {
    tmp = new URL(url)
  } catch (_) {
    return true
  }

  return tmp?.host !== window.location.host
}
