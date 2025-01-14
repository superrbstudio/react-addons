import { PropsWithChildren } from 'react'
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'

export default function ContextWrapper({ children }: PropsWithChildren<{}>) {
  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_KEY as string}
    >
      {children}
    </GoogleReCaptchaProvider>
  )
}
