import { FieldError, FieldErrorsImpl, Merge } from 'react-hook-form'
import { AnySchema } from 'yup'

export interface ErrorMessageProps {
  error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>>
  fieldSchema?: AnySchema
}

export default function ErrorMessage({ error }: ErrorMessageProps) {
  const GENERIC_ERROR = 'Sorry, an error occurred'

  return (
    <span className="form__error">
      {(error?.message as string) || GENERIC_ERROR}
    </span>
  )
}
