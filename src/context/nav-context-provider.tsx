'use client'

import { useLockBodyScroll } from '../hooks'
import { createContext, PropsWithChildren, useCallback, useState } from 'react'

export const NavContext = createContext({
  navOpen: false,
  toggleNav: () => {},
  openNav: () => {},
  closeNav: () => {},
})

export const NavContextProvider = ({ children }: PropsWithChildren) => {
  const [navOpen, setNavOpen] = useState<boolean>(false)
  useLockBodyScroll(navOpen)

  const toggleNav = useCallback(() => {
    setNavOpen((navOpen) => !navOpen)
  }, [setNavOpen])

  const openNav = useCallback(() => {
    setNavOpen(true)
  }, [setNavOpen])

  const closeNav = useCallback(() => {
    setNavOpen(false)
    ;(document.activeElement as HTMLElement)?.blur()
  }, [setNavOpen])

  return (
    <NavContext.Provider value={{ navOpen, toggleNav, openNav, closeNav }}>
      {children}
    </NavContext.Provider>
  )
}

export default NavContextProvider
