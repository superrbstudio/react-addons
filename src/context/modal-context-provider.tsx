'use client'

import { createContext, PropsWithChildren, useState } from 'react'

export const ModalContext = createContext({
  openState: {} as OpenState,
  isOpen: (name: string) => false as boolean,
  openModal: (name: string) => {},
  closeModal: (name: string) => {},
})

interface OpenState {
  [key: string]: boolean
}

export function ModalContextProvider({ children }: PropsWithChildren) {
  const [openState, setOpenState] = useState<OpenState>({})

  const isOpen = (name: string) => {
    return openState[name] || false
  }

  const openModal = (name: string) => {
    setOpenState((state) => {
      const newState = { ...state }
      newState[name] = true

      return newState
    })
  }

  const closeModal = (name: string) => {
    setOpenState((state) => {
      const newState = { ...state }
      newState[name] = false

      return newState
    })
  }

  return (
    <ModalContext.Provider value={{ openState, isOpen, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  )
}

export default ModalContextProvider
