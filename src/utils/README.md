# React Addons Utilities

## [animate](./animate.ts)

Allows the animation of any numeric value over a given duration, including custom [easing](./easing-functions.ts).

### Usage

```tsx
import React, { useCallback, useState } from 'react'
import { easeInOutCubic } from '@superrb/gatsby-addons/src/utils/easing-functions'
import { animate } from '@superrb/gatsby-addons/utils'

const MyComponent = () => {
  const [value, setValue] = useState<number>(0)

  const handleClick = useCallback(() => {
    animate(
      0,
      100,
      (v) => {
        setValue(v)
      },
      1000,
      easeInOutCubic,
    )
  }, [setValue])

  return <button onClick={handleClick}>{value}</button>
}
```

## [animator](./animator.ts)

Uses `IntersectionObserver` to set classes on elements as they appear in the viewport. To be coupled with CSS animations.

```tsx
import React from 'react'
import { animator } from '@superrb/gatsby-addons/utils'

// Component will recieve a class of `animated` when in the viewport
const MyComponent = <div ref={animator}></div>
```

## [isExternalLink](./is-external-link.ts)

Used to determine whether a given URL is internal or external

### Usage

```tsx
import { isExternalLink } from '@superrb/gatsby-addons/utils'

isExternalLink('https://superrb.com') // true
isExternalLink('/home') // false
```

## [extendClass](./extend-class.ts)

Used within wrapper components to extend a provided className for BEM-compatible child components

### Usage

```tsx
import { extendClass } from '@superrb/gatsby-addons/utils'

const className = extendClass('header', 'item') // Returns a BEM-compatible class name of `header__item`
```

## [getYPos](./get-y-pos.ts)

Get the pixel distance of an element from the top of the document

### Usage

```tsx
import { getYPos } from '@superrb/gatsby-addons/utils'

getYPos(document.getElementById('#content'))
```

## [get](./get.ts)

An adaptation of `lodash.get`, used to retrieve deeply-nested properties from objects using dot-notation.

### Usage

```tsx
const object = {
  first: {
    second: {
      third: true
    }
  }
}

const value = get('first.second.third', object) // true
```

You can also pass a third parameter to set a default to be return if any level of the object returns undefined.

```tsx
const value = get('first.fourth', object, 'Default') // Default
```

## [isExternalLink](./is-external-link.ts)

Compares a given URL with the current hostname to check if link is to an external site or not

### Usage

```tsx
import { isExternalLink } from '@superrb/gatsby-addons/utils'

isExternalLink('https://google.com') // true
isExternalLink('/test') // false
```

## [storageFactory](./storage-factory.ts)

A safe wrapper around browser storage, which creates its own in-memory store if the requested storage is unavailable (for example, if user has blocked cookies in Safari, which causes accessing `localStorage` and `sessionStorage` to throw a fatal error when accessed)

### Usage

```tsx
import { storageFactory } from '@superrb/gatsby-addons/utils'

const session = storageFactory(() => sessionStorage)

session.setItem('test', 'test')
```

Addons comes with built-in wrappers for `sessionStorage` and `localStorage`.

```tsx
import { session } from '@superrb/gatsby-addons/storage'

session.getItem('testing') // No longer throws an error if access to sessionStorage is blocked, and just stores data in memory
```
