import { create } from 'zustand'
import { mountStoreDevtool } from 'simple-zustand-devtools'

interface ModalState {
  openState: {
    [key: string]: boolean
  }
  isOpen: (name: string) => boolean
  openModal: (name: string) => void
  closeModal: (name: string) => void
}

const useModalStore = create<ModalState>()((set, get) => {
  return {
    openState: {},
    isOpen: (name: string) => get().openState[name],
    openModal: (name: string) =>
      set((state) => ({ openState: { ...state.openState, [name]: true } })),
    closeModal: (name: string) =>
      set((state) => ({ openState: { ...state.openState, [name]: false } })),
  }
})

if (process.env.NODE_ENV === 'development') {
  mountStoreDevtool('ModalStore', useModalStore)
}

export default useModalStore
