'use client'

import {
  useState,
  PropsWithChildren,
  useEffect,
  useRef,
  useCallback,
  RefObject,
} from 'react'
import { local } from '../storage'
import { useEventListener, useLockBodyScroll, useModal } from '../hooks'

interface Props {
  name: string
  className?: string
  openAfter?: number
  dismissable?: boolean
  preventScroll?: boolean
}

export default function Modal({
  name,
  className,
  openAfter,
  dismissable = false,
  preventScroll = true,
  children,
}: PropsWithChildren<Props>) {
  const [dismissed, setDismissed] = useState<boolean>(false)
  const openTimer = useRef<NodeJS.Timeout>(null)
  const ref = useRef<HTMLDialogElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const documentRef = useRef<Document>(
    typeof document !== 'undefined' ? document : null,
  ) as RefObject<Document>

  const { isOpen, openModal, closeModal } = useModal(name)
  useLockBodyScroll(isOpen && preventScroll)

  useEffect(() => {
    if (dismissable) {
      setDismissed(local.getItem(`${name}-popup-dismissed`) === 'true')
    }
  }, [dismissable, name])

  useEffect(() => {
    if (openTimer.current) {
      clearTimeout(openTimer.current)
    }

    if (!dismissed && openAfter) {
      openTimer.current = setTimeout(() => {
        openModal()
      }, openAfter)
    }
  }, [dismissed, openAfter, openModal])

  useEffect(() => {
    if (isOpen) {
      ref.current?.showModal()
    } else {
      ref.current?.close()
    }

    return () => {
      ref.current?.close()
    }
  }, [isOpen])

  useEventListener('click', closeModal, undefined, documentRef)

  const close = useCallback(() => {
    closeModal()

    if (dismissable) {
      local.setItem(`${name}-popup-dismissed`, 'true')
      setDismissed(true)
    }
  }, [dismissable, name, closeModal])

  return (
    <dialog id={name} className={`modal ${className}`} ref={ref}>
      <button className={'modal__close'} onClick={close}>
        <span className="screenreader-text">Close Modal</span>
        &times;
      </button>

      <div
        className={'modal__inner'}
        ref={innerRef}
        onClick={(event) => event.nativeEvent.stopImmediatePropagation()}
      >
        {children}
      </div>
    </dialog>
  )
}
