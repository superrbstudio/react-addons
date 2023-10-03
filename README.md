# React Addons

## Installation

First, install the package

```sh
yarn add @superrb/react-addons
```

## Context Providers

Add the context wrapper to your layout to ensure you can use all [contexts](./src/context/README.md) you wish to use.

```tsx
import { ContextWrapper } from '@superrb/react-addons/components'

export const Layout = ({ children }) => (
  <ContextWrapper>
    {children}
  </ContextWrapper>
)
```

## Further Documentation
* [Components](./src/components/README.md)
* [Contexts](./src/context/README.md)
* [Hooks](./src/hooks/README.md)
* [Utilities](./src/utils/README.md)
