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
  popupOpen: false,
  openPopup: () => {},
  closePopup: () => {},
})

export const CookiesContextProvider = ({ children }: PropsWithChildren<{}>) => {
  const [cookiesAccepted, setCookiesAcceptedStorage] = useState<boolean>(false)
  const [popupOpen, setPopupOpenStorage] = useState<boolean>(false)
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

  const openPopup = useCallback(() => {
    setPopupOpenStorage(true)
  }, [setPopupOpenStorage])

  const closePopup = useCallback(() => {
    setPopupOpenStorage(false)
  }, [setPopupOpenStorage])

  return (
    <CookiesContext.Provider
      value={{
        cookiesAccepted,
        setCookiesAccepted,
        trackingCookiesAccepted,
        setTrackingCookiesAccepted,
        popupOpen,
        openPopup,
        closePopup,
      }}
    >
      {children}
    </CookiesContext.Provider>
  )
}

export default CookiesContextProvider
