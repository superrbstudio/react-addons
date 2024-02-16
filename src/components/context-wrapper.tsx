import { PropsWithChildren } from 'react'
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'

const ContextWrapper = ({ children }: PropsWithChildren<{}>) => (
  <GoogleReCaptchaProvider
    reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_KEY as string}
  >
    {children}
  </GoogleReCaptchaProvider>
)

export default ContextWrapper
