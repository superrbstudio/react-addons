'use client'

import {
  ButtonHTMLAttributes,
  PropsWithChildren,
  ReactNode,
  useCallback,
} from 'react'
import { Button } from '../components'
import { extendClass } from '../utils'
import useNavStore from '../store/nav'

interface Props
  extends PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>> {
  'aria-controls': string
  className?: string
  label?: string
  closeLabel?: string
  renderIcon?: (navOpen: boolean) => ReactNode
}

const MenuToggle = ({
  'aria-controls': ariaControls,
  className = '',
  label = 'Open Nav',
  closeLabel = 'Close Nav',
  renderIcon = (navOpen) => (navOpen ? '×' : '☰'),
  ...props
}: Props) => {
  const { navOpen, toggleNav } = useNavStore()

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
        {renderIcon(navOpen)}
      </span>
    </Button>
  )
}

export default MenuToggle
