# React Addons Components

## [BackToTop](./back-to-top.tsx)

Adds a hidden back-to-top link for accessibility purposes.

### Usage

```tsx
<BackToTop />
```

Should be combined with the following sass

```sass
.back-to-top
  display: none

  &:focus-within
    display: block
```

## [Button](./button.tsx)

Creates a button. Determines whether to use an `<a>`, `<Link>` or `<button>` element depending on the props passed.

### Usage

```tsx
<Button href={'https://superrb.com'} label={'The visible label'} label_a11y={'A separate label for screenreaders'} />
```

## [ContextWrapper](./context-wrapper.tsx)

A wrapper component containing providers for all contexts within addons.

### Usage

```tsx
<ContextWrapper>
  <Layout />
</ContextWrapper>
```

## [CookieBanner](./cookie-banner.tsx)

A cookie banner container user-customisable options for tracking.

### Usage

```tsx
<CookieBanner
  allowCustomisation={false} {/* Whether to allow users to reject tracking cookies individually */}
  allowReject={true}         {/* Whether to include a reject button. Automatically false if allowCustomisation=true */}
  text="We use cookies to provide and improve our services. Sadly, not the delicious kind. Are you okay with that?"
  policyLabel="Curious about cookies?"
/>
```

## [Form](./form.tsx)

Creates a form, with field structure defined by a [Yup](https://npmjs.com/package/yup) schema. See [full documentation](./form/README.md)

### Usage

```tsx
import { Form } from '@superrb/gatsby-addons/components'
import * as yup from 'yup'

const OPTIONS = [
  'Option 1',
  'Option 2'
]

const schema = yup.object({
  name: yup.string().required(),
  select: yup.string().oneOf(OPTIONS).required(),            // The `oneOf` validation rule will automatically trigger a select box
  message: yup.string().meta({ textarea: true }).required() // Set `textarea: true` in the fields metadata to display a textarea
})

const Page = () => (
  <Form action="https://yoursite.com/send" schema={schema} />
)
```

## [Menu Toggle](./menu-toggle.tsx)

Renders a button which is automatically set up to toggle the `navOpen` property of [`NavContext`](../context/README.md#nav)

### Usage

```tsx
<MenuToggle />
```

## [Modal](./modal.tsx)

A reusable modal component.

### Usage

```tsx
<Modal
  name="newsletter"   {/* The name used to refer to this modal when using the ModalContext or useModal hook */}
  openAfter={5000}    {/* If set, the modal will automatically open after the number of ms */}
  dismissable={true}  {/* If false, the modal will not include a close button and cannot be dismissed.
                          Use the [`useModal`](../hooks/README.md#useModal) hook to close the modal */}
>
  {children}
</Modal>
```

## [SkipTo](./skip-to.tsx)

Adds hidden skip-to links for accessibility.

### Usage

```tsx
<SkipTo />
```

Should be combined with the following sass

```sass
.skip-to
  display: none

  &:focus-within
    display: block
```
