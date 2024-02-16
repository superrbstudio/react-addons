import useModalStore from '../store/modal'

const useModal = (name: string) => {
  const isOpen = useModalStore((state) => state.openState[name])
  const openModal = useModalStore((state) => state.openModal)
  const closeModal = useModalStore((state) => state.closeModal)

  return {
    isOpen,
    openModal: () => openModal(name),
    closeModal: () => closeModal(name),
  }
}

export default useModal
