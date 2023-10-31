import { PropsWithChildren } from 'react'
import {
  CookiesContextProvider,
  ModalContextProvider,
  NavContextProvider,
} from '../context'
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'

const ContextWrapper = ({ children }: PropsWithChildren<{}>) => (
  <GoogleReCaptchaProvider
    reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_KEY as string}
  >
    <CookiesContextProvider>
      <ModalContextProvider>
        <NavContextProvider>{children}</NavContextProvider>
      </ModalContextProvider>
    </CookiesContextProvider>
  </GoogleReCaptchaProvider>
)

export default ContextWrapper
