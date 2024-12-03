import { create } from 'zustand'
import { mountStoreDevtool } from 'simple-zustand-devtools'
import Cookies from 'js-cookie'

export interface CookieState {
  cookiesAccepted: boolean
  trackingCookiesAccepted: boolean
  setCookiesAccepted: (accepted: boolean) => void
  setTrackingCookiesAccepted: (accepted: boolean) => void
  popupOpen: boolean
  openPopup: () => void
  closePopup: () => void
}

const useCookieStore = create<CookieState>()((set) => {
  const cookiesAccepted = !!Cookies.get('accepted-cookies') || false
  const trackingCookiesAccepted =
    !!Cookies.get('accepted-tracking-cookies') || false
  return {
    cookiesAccepted,
    trackingCookiesAccepted,
    setCookiesAccepted: (accepted: boolean) => {
      Cookies.set('accepted-cookies', accepted.toString(), {
        expires: 30,
      })
      return set((state: CookieState) => ({ cookiesAccepted: accepted }))
    },
    setTrackingCookiesAccepted: (accepted: boolean) => {
      Cookies.set('accepted-tracking-cookies', accepted.toString(), {
        expires: 30,
      })
      return set((state: CookieState) => ({
        trackingCookiesAccepted: accepted,
      }))
    },
    popupOpen: false,
    openPopup: () => set({ popupOpen: true }),
    closePopup: () => set({ popupOpen: false }),
  }
})

if (process.env.NODE_ENV === 'development') {
  mountStoreDevtool('CookieStore', useCookieStore)
}

export default useCookieStore
