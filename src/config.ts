import { EVAL, INLINE, SELF, NONE, CSPDirectives } from 'csp-header'

export type CSPPresetGenerator = (...args: any[]) => Partial<CSPDirectives>

export const cspConfig: CSPPresetGenerator = () => ({
  'default-src': [SELF],
  'connect-src': [SELF],
  'script-src': [SELF, INLINE, EVAL, 'netlify-run.netlify.app'],
  'style-src': [SELF, INLINE],
  'img-src': [SELF, 'blob:', 'data:'],
  'font-src': [SELF, 'data:'],
  'object-src': [NONE],
  'media-src': [SELF, 'blob:', 'data:'],
  'frame-src': [SELF, 'app.netlify.com'],
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
