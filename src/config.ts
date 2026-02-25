import { EVAL, INLINE, SELF, NONE, DATA, BLOB, CSPDirectives } from 'csp-header'

export type CSPPresetGenerator = (...args: any[]) => Partial<CSPDirectives>

export const cspConfig: CSPPresetGenerator = () => ({
  'default-src': [SELF],
  'connect-src': [SELF],
  'script-src': [SELF, INLINE, EVAL],
  'style-src': [SELF, INLINE],
  'img-src': [SELF, BLOB, DATA],
  'font-src': [SELF, DATA],
  'object-src': [NONE],
  'media-src': [SELF, BLOB, DATA],
  'frame-src': [SELF],
  'frame-ancestors': [SELF],
  'base-uri': [SELF],
  'form-action': [SELF],
})

export const recaptchaCspConfig: CSPPresetGenerator = () => ({
  'connect-src': ['https://www.google.com/recaptcha/'],
  'script-src': [
    'https://www.google.com/recaptcha/',
    'https://www.gstatic.com/recaptcha/',
  ],
  'frame-src': ['https://www.google.com/recaptcha/'],
})

export const googleTagManagerCspConfig: CSPPresetGenerator = () => ({
  'connect-src': [
    'www.googletagmanager.com',
    'www.google.com',
    'https://*.google-analytics.com',
    'https://*.analytics.google.com',
    'https://*.googletagmanager.com',
    'https://pagead2.googlesyndication.com',
    'https://www.googleadservices.com',
    'https://googleads.g.doubleclick.net',
    'https://www.google.com',
    'https://google.com',
  ],
  'script-src': [
    'https://www.googletagmanager.com',
    'https://googletagmanager.com',
    'https://tagmanager.google.com',
    'https://*.googletagmanager.com',
    'https://www.googleadservices.com',
    'https://www.google.com',
    'https://pagead2.googlesyndication.com',
    'https://googleads.g.doubleclick.net',
  ],
  'frame-src': [
    'https://www.googletagmanager.com',
  ],
  'img-src': [
    'www.googletagmanager.com',
    'https://googletagmanager.com',
    'https://ssl.gstatic.com',
    'https://www.gstatic.com',
    'https://*.google-analytics.com',
    'https://*.googletagmanager.com',
    'https://www.googletagmanager.com',
    'https://googleads.g.doubleclick.net',
    'https://www.google.com',
    'https://pagead2.googlesyndication.com',
    'https://www.googleadservices.com',
    'https://google.com',
  ],
  'style-src': [
    'https://googletagmanager.com',
    'https://tagmanager.google.com',
    'https://fonts.googleapis.com',
  ],
  'font-src': ['https://fonts.gstatic.com'],
})

export const facebookPixelCspConfig: CSPPresetGenerator = () => ({
  'script-src': ['https://connect.facebook.net'],
})

export const typekitCspConfig: CSPPresetGenerator = () => ({
  'script-src': ['use.typekit.net'],
  'style-src': ['use.typekit.net'],
  'img-src': ['p.typekit.net'],
  'connect-src': ['performance.typekit.net'],
})

export const cloudflareCspConfig: CSPPresetGenerator = () => ({
  'script-src': [
    SELF,
    INLINE,
    'ajax.cloudflare.com',
    'static.cloudflareinsights.com',
    'https://challenges.cloudflare.com',
  ],
  'connect-src': ['cloudflareinsights.com'],
  'frame-src': ['https://challenges.cloudflare.com'],
})