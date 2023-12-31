'use client'

import {
  PropsWithChildren,
  createContext,
  useCallback,
  useEffect,
  useState,
} from 'react'
import Cookies from 'js-cookie'

export const CookiesContext = createContext({
  cookiesAccepted: false,
  setCookiesAccepted: (accepted: boolean) => {},
  trackingCookiesAccepted: false,
  setTrackingCookiesAccepted: (accepted: boolean) => {},
})

export const CookiesContextProvider = ({ children }: PropsWithChildren<{}>) => {
  const [cookiesAccepted, setCookiesAcceptedStorage] = useState<boolean>(false)
  const [trackingCookiesAccepted, setTrackingCookiesAcceptedStorage] =
    useState<boolean>(false)

  useEffect(() => {
    const accepted = Cookies.get('accepted-cookies') || false
    setCookiesAcceptedStorage(!!accepted)
  }, [setCookiesAcceptedStorage])

  useEffect(() => {
    const accepted = Cookies.get('accepted-tracking-cookies') || false
    setTrackingCookiesAcceptedStorage(!!accepted)
  }, [setTrackingCookiesAcceptedStorage])

  const setCookiesAccepted = useCallback(
    (accepted: boolean) => {
      Cookies.set('accepted-cookies', accepted.toString(), {
        expires: 30,
      })
      setCookiesAcceptedStorage(accepted)
    },
    [setCookiesAcceptedStorage],
  )

  const setTrackingCookiesAccepted = useCallback(
    (accepted: boolean) => {
      Cookies.set('accepted-tracking-cookies', accepted.toString(), {
        expires: 30,
      })
      setTrackingCookiesAcceptedStorage(accepted)
    },
    [setTrackingCookiesAcceptedStorage],
  )

  return (
    <CookiesContext.Provider
      value={{
        cookiesAccepted,
        setCookiesAccepted,
        trackingCookiesAccepted,
        setTrackingCookiesAccepted,
      }}
    >
      {children}
    </CookiesContext.Provider>
  )
}

export default CookiesContextProvider
