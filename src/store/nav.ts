import { create } from 'zustand'
import { mountStoreDevtool } from 'simple-zustand-devtools'

interface NavState {
  navOpen: boolean
  toggleNav: () => void
  openNav: () => void
  closeNav: () => void
}

const useNavStore = create<NavState>()((set) => ({
  navOpen: false,
  toggleNav: () => set((state) => ({ navOpen: !state.navOpen })),
  openNav: () => set({ navOpen: true }),
  closeNav: () => set({ navOpen: false }),
}))

if (process.env.NODE_ENV === 'development') {
  mountStoreDevtool('NavStore', useNavStore)
}

export default useNavStore
