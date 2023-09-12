# Form Component

## Usage

```tsx
import { Form } from '@superrb/gatsby-addons/components'
import * as yup from 'yup'

const OPTIONS = [
  'Option 1',
  'Option 2'
]

const schema = yup.object({
  name: yup.string().required(),
  select: yup.string().meta({ options: OPTIONS }).required(), // The `options` meta field will automatically trigger a select box
  message: yup.string().meta({ textarea: true }).required() // Set `textarea: true` in the fields metadata to display a textarea
  hidden: yup.string().meta({ hidden: true }).required() // Set `hidden: true` in the fields metadata to create a hidden field
})

const Page = () => (
  <Form action="https://yoursite.com/send" schema={schema} />
)
```

## Options

### Custom success message

The form comes with a default [success message component](./success-message.tsx), shown after successful submission of the form. You can override this by passing custom JSX to the `renderSuccessMessage` prop.

```tsx
import { Form } from '@superrb/gatsby-addons/components'
import * as yup, { InferType } from 'yup'

const schema = yup.object({
  name: yup.string().required()
})

const Page => () => (
  <Form
    action="https://yoursite.com/send"
    schema={schema}
    renderSuccessMessage={(data: InferType<typeof schema>) => (
      <h1>Tada! Hi {data.name}</h1>
    )}
  />
)
```

### Custom error message

There is also a default [error message component](./error-message.tsx), which can also be overridden, using the `renderErrorMessage` prop.

```tsx
import { Form } from '@superrb/gatsby-addons/components'
import * as yup, { InferType } from 'yup'
import { OptionalObjectSchema } from 'yup/lib/object'
import { FieldError } from 'react-hook-form'

const schema = yup.object({
  name: yup.string().required()
})

const Page => () => (
  <Form
    action="https://yoursite.com/send"
    schema={schema}
    renderErrorMessage={(error?: FieldError, fieldSchema?: OptionalObjectSchema<any>) => (
      <>
        <h1>Uh Oh! Something went wrong</h1>
        <p>The error was: {error}</p>
      </>
    )}
  />
)
```

### Customise individual fields

You can override the HTML for specific fields by passing an object to the `renderers` prop.

```tsx
import { Form } from '@superrb/gatsby-addons/components'
import * as yup from 'yup'
import { OptionalObjectSchema } from 'yup/lib/object'
import { FieldError } from 'react-hook-form'

const schema = yup.object({
  dob: yup.string().date().required()
})

const Page => () => (
  <Form
    action="https://yoursite.com/send"
    schema={schema}
    renderers={{
      dob: (props, error?: FieldError, fieldSchema?: OptionalObjectSchema<any>) => (
        <input type="date" {...props} />
      )
    }}
  />
)
```
