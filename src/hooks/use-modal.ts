import { useContext, useEffect, useState } from "react"
import { ModalContext } from "../context"

const useModal = (name: string) => {
  const [open, setOpen] = useState<boolean>(false)
  const { openState, openModal, closeModal } = useContext(ModalContext)

  useEffect(() => {
    setOpen(openState[name])
  }, [openState[name]])

  return {
    isOpen: open,
    openModal: () => openModal(name),
    closeModal: () => closeModal(name),
  }
}

export default useModal
