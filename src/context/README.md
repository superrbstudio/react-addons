# Gatsby Addons Contexts

## [Cookies](./cookies-context-provider.tsx)

A global context for management of user preferences for cookies. Used in conjunction with the [`CookieBanner`](../components/README.md#CookieBanner) component.

### Usage

```tsx
import { CookiesContext } from '@superrb/react-addons/context'

const Scripts = () => {
  const { cookiesAllowed, trackingCookiesAllowed } = useContext(CookiesContext)

  return (
    <>
      {cookiesAllowed && (
        {/* Scripts which store necessary cookies that the user cannot reject */}
      )}
      {trackingCookiesAllowed && (
        {/* Scripts which store tracking cookies. These will only be rendered if the user accepts them */}
      )}
    </>
  )
}
```

## [Modal](./modal-context-provider.tsx)

A context for managing state for modals. In normal use, use the [`useModal`](../hooks/README.md#useModal) hook instead of accessing the context directly.

### Usage

```tsx
import { ModalContext } from '@superrb/react-addons/context'

const MyComponent = () => {
  const { openState, openModal, closeModal } = useContext(ModalContext)

  const name = 'newsletter'
  const isOpen = openState[name]
  openModal(name)

  return (
    <Button onClick={closeModal} />
  )
}
```

## [Nav](./nav-context-provider.tsx)

A simple global context to allow components to control a navigation menu.

### Usage

```tsx
import React, { useContext } from 'react'
import { NavContext } from '@superrb/gatsby-addons/context'

const Header = () => {
  const { navOpen, closeNav } = useContext(NavContext)

  return (
    <header className={`header ${navOpen ? 'header--nav-open' : ''}`}>
      <a href="https://some.url" onClick={closeNav}>Click me!</a>
    </header>
  )
}
```
