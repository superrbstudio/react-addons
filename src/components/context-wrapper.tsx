import { PropsWithChildren } from 'react'
import { ModalContextProvider, NavContextProvider } from '../context'
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'

const ContextWrapper = ({ children }: PropsWithChildren<{}>) => (
  <GoogleReCaptchaProvider
    reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_KEY as string}
  >
    <ModalContextProvider>
      <NavContextProvider>{children}</NavContextProvider>
    </ModalContextProvider>
  </GoogleReCaptchaProvider>
)

export default ContextWrapper
