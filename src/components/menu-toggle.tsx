'use client'

import {
  ButtonHTMLAttributes,
  PropsWithChildren,
  ReactElement,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { NavContext } from '../context'
import { Button } from '../components'
import { extendClass } from '../utils'

interface Props
  extends PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>> {
  'aria-controls': string
  className?: string
  label?: string
  closeLabel?: string
  renderIcon?: (navOpen: boolean) => ReactElement
}

const MenuToggle = ({
  'aria-controls': ariaControls,
  className = '',
  label = 'Open Nav',
  closeLabel = 'Close Nav',
  renderIcon = undefined,
  ...props
}: Props) => {
  const { navOpen, toggleNav } = useContext(NavContext)
  const [icon, setIcon] = useState<ReactElement | string>(navOpen ? '×' : '꠵')

  useEffect(() => {
    if (renderIcon) {
      setIcon(renderIcon(navOpen))

      return
    }

    setIcon(navOpen ? '×' : '꠵')
  }, [navOpen, renderIcon])

  const handleClick = useCallback(() => {
    if (
      document &&
      document?.activeElement instanceof Element &&
      'blur' in document?.activeElement
    ) {
      ;(document.activeElement as HTMLElement)?.blur()
    }

    toggleNav()
  }, [toggleNav])

  return (
    <Button
      className={`menu-toggle ${className}`}
      onClick={handleClick}
      aria-expanded={navOpen}
      aria-controls={ariaControls}
      label_a11y={navOpen ? closeLabel : label}
      {...props}
    >
      <span className={`menu-toggle__icon ${extendClass(className, 'icon')}`}>
        {icon}
      </span>
    </Button>
  )
}

export default MenuToggle
