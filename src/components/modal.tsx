'use client'

import {
  useState,
  PropsWithChildren,
  useEffect,
  MutableRefObject,
  useRef,
  useCallback,
} from 'react'
import { local } from '../storage'
import {
  useEscape,
  useEventListener,
  useLockBodyScroll,
  useModal,
} from '../hooks'

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
  const openTimer = useRef<NodeJS.Timeout>() as MutableRefObject<NodeJS.Timeout>
  const ref = useRef<HTMLElement>() as MutableRefObject<HTMLElement>
  const innerRef = useRef<HTMLDivElement>() as MutableRefObject<HTMLDivElement>

  const { isOpen, openModal, closeModal } = useModal(name)
  useLockBodyScroll(isOpen && preventScroll)

  useEffect(() => {
    if (dismissable) {
      setDismissed(local.getItem(`${name}-popup-dismissed`) === 'true')
    }
  }, [dismissable, name])

  useEffect(() => {
    clearTimeout(openTimer.current)
    if (!dismissed && openAfter) {
      openTimer.current = setTimeout(() => {
        openModal()
      }, openAfter)
    }
  }, [dismissed, openAfter, openModal])

  useEscape(ref, closeModal)

  useEventListener(
    'click',
    closeModal,
    undefined,
    typeof document !== 'undefined' ? document : undefined,
  )

  useEventListener(
    'click',
    (event) => event.stopPropagation(),
    undefined,
    innerRef.current,
  )

  const close = useCallback(() => {
    closeModal()

    if (dismissable) {
      local.setItem(`${name}-popup-dismissed`, 'true')
      setDismissed(true)
    }
  }, [dismissable, name, closeModal])

  return (
    <aside
      id={name}
      className={`modal ${className}`}
      aria-hidden={!isOpen}
      ref={ref}
    >
      <button className={'modal__close'} onClick={close}>
        <span className="screenreader-text">Close Modal</span>
        &times;
      </button>

      <div className={'modal__inner'} ref={innerRef}>
        {children}
      </div>
    </aside>
  )
}
