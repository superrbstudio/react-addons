# React Addons Hooks

## [useAsync](./use-async.ts)

Allows asynchronous fetch operations to be run, whilst handling success, error and processing states.

### Usage

```tsx
import React, { useCallback } from 'react'
import { useAsync } from '@superrb/gatsby-addons/hooks'

const MyComponent = () => {
  const onSubmit = useCallback(async (data) => {
    return validate(data)
  })

  // Passing `true` as the second argument, will also run the callback immediately on page load
  // The third argument is a dependency array, which works in the same way as `useEffect`.
  // When a change to an item in the dependency array occurs, the hooks state is reset
  const { execute, status, error } = useAsync(onSubmit, false, [onSubmit])

  return (
    {status === 'success' ? (
      <div>
        {'Success message'}
      </div>
    ) : (
      <form onSubmit={execute}>
        {status === 'error' && (
          <span>{error}</span>
        )}

        {status !== 'pending' && (
          <button type="submit">Submit</button>
        )}
      </form>
    )}
  )
}
```

## [useDraggableScroll](./use-draggable-scroll.ts)

Enables click and drag to scroll an element with overflow.

The `className` passed to the object should match the container. The component then adds and removes the following classes as you interact with it (based on a class of `list`):

- `list--draggable` - automatically added when the `scrollWidth` of the container is larger than the containers width
- `list--scrolling` - added when a `scroll` event is fired on the container
- `list--dragging` - added when the user begins dragging the container

### Usage

```tsx
import React, { useRef, MutableRefObject } from 'react'
import { useDraggableScroll } from '@superrb/gatsby-addons/hooks'

const MyComponent = () => {
  const scrollContainer =
    useRef<HTMLUListElement>() as MutableRefObject<HTMLUListElement>
  const { events } = useDraggableScroll(scrollContainer, { className: 'list' })

  return (
    <ul class="list" ref={scrollContainer} {...events}>
      {items.map((item) => (
        <Item item={item} />
      ))}
    </ul>
  )
}
```

## [useEventListener](./use-event-listener.ts)

Adds an event listener to an object, with an optional conditional flag.

### Usage

```tsx
import React, { useCallback, useState } from 'react'
import { useEventListener } from '@superrb/gatsby-addons/hooks'

const MyComponent = () => {
  const [yPos, setYPos] = useState<number>(0)
  const handleScroll = useCallback((event) => {
    setYPos(window.scrollY)
  }, [])

  useEventListener(
    'scroll',
    handleScroll,
    { passive: true },
    typeof window !== 'undefined' ? window : null,
  )

  return () => {
    ;<>{yPos}</>
  }
}
```

#### Attach event listeners conditionally

Passing a 5th boolean parameter, allows the event listener to be added when the parameter resolves to true, for example, using the [`isInViewport`](#isInViewport) to only attach the event listener when the component is within the viewport.

```tsx
import React, { useCallback, useState } from 'react'
import { useEventListener } from '@superrb/gatsby-addons/hooks'

const MyComponent = () => {
  const [yPos, setYPos] = useState<number>(0)
  const { isInViewport, setRef } = useIsInViewport(false)
  const handleScroll = useCallback((event) => {
    setYPos(window.scrollY)
  }, [])

  useEventListener(
    'scroll',
    handleScroll,
    { passive: true },
    typeof window !== 'undefined' ? window : null,
    isInViewport,
  )

  return () => {
    ;<div ref={setRef}>{yPos}</div>
  }
}
```

## [useHideOnScroll](./use-hide-on-scroll.ts)

Used to hide an element on scroll down, and show it on scroll up. Usually used for fixed navigation.

```tsx
import React from 'react'
import { useHideOnScroll } from '@superrb/gatsby-addons/hooks'

const MyComponent = () => {
  const hidden = useHideOnScroll(false) // Argument determines whether element is hidden before first scroll

  return <div aria-hidden={hidden}></div>
}
```

## [useId](./use-id.ts)

Generate a unique ID for a component with a given prefix.

### Usage

```tsx
import React from 'react'
import { useId } from '@superrb/gatsby-addons/hooks'

const MyComponent = () => {
  const id = useId('my-component-')

  return <div id={id}></div>
}
```

## [useIsInViewport](./use-is-in-viewport.ts)

Returns true/false depending on whether or not the given ref is visible on screen.

### Usage

```tsx
import React from 'react'
import { useIsInViewport } from '@superrb/gatsby-addons/hooks'

const MyComponent = () => {
  const { isInViewport, setRef } = useIsInViewport(false)

  return (
    <div ref={setRef}>{isInViewport ? 'Now you see me' : "Now you don't"}</div>
  )
}
```

Root margin and threshold for the internal IntersectionObserver can be overridden by passing them to the hook

```tsx
const { isInViewport, setRef } = useIsInViewport(
  false,
  '100px 100px',
  [0, 0.25, 0.5, 0.75, 1],
)
```

## [useIsMobile](./use-is-mobile.ts)

Returns true/false depending on whether the screen size is smaller than a given size (default: `63.75em`)

### Usage

```tsx
import React from 'react'
import { useIsMobile } from '@superrb/gatsby-addons/hooks'

const MyComponent = () => {
  const isMobile = useIsMobile(false, '90em')

  return (
    <>
      {isMobile : 'This is a mobile device' : 'This is a desktop device'}
    </>
  )
}
```

## [useIsOverflowing](./use-is-overflowing.ts)

Returns true if the passed ref contains enough content to cause it to scroll.

### Usage

```tsx
const element = useRef<HTMLElement>() as MutableRefObject<HTMLElement>
const isOverflowing = useIsOverflowing(element.current)

return (
  <div ref={element} />
)
```

## [useLockBodyScroll](./use-lock-body-scroll.ts)

Use a boolean flag to determine whether scrolling should be disabled on the body (for example when a modal is open)

### Usage

```tsx
import React, { useState } from 'react'
import { useLockBodyScroll } from '@superrb/gatsby-addons/hooks'

const MyComponent = () => {
  const [open, setOpen] = useState<boolean>(false)

  useLockBodyScroll(open)
}
```

## [useModal](./use-modal.ts)

When used in conjunction with the [`Modal`](../components/README.md#modal) component, provides methods for opening/closing the modal from another component.

### Usage

```tsx
const { isOpen, openModal, closeModal } = useModal('newsletter')

if (isOpen) {
  closeModal()
}
```

## [useMotionAllowed](./use-motion-allowed.ts)

Returns true/false depending on whether the users would prefer reduced motion (based on `@media (prefers-reduced-motion: reduce)`)

### Usage

```tsx
import React from 'react'
import { useMotionAllowed } from '@superrb/gatsby-addons/hooks'

const MyComponent = () => {
  const isMotionAllowed = useMotionAllowed(false)

  return <>{motionAllowed ? <Animation /> : 'No animation'}</>
}
```

## [useParallax](./use-parallax.ts)

Provides efficient parallax calculations for a given `ref`, without use of `element.getBoundingClientRect()`

### Usage

```tsx
import React, { useRef } from 'react'
import { useParallax } from '@superrb/gatsby-addons/hooks'

const MyComponent = () => {
  const ref = useRef<HTMLElement>() as MutableRefObject<HTMLElement>
  const pos = useParallax(ref)

  return (
    <div ref={ref}>
      <div style={{ transform: `translateY(${pos / 5}%)` }} />
    </div>
  )
}
```
