import { create } from 'zustand'

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

export default useNavStore
