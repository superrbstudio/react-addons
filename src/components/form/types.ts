import { ReactNode } from "react"
import { FieldError } from "react-hook-form"
import { AnySchema } from "yup"

export type FieldRenderer = (
  props: object,
  error?: FieldError,
  schema?: AnySchema
) => ReactNode
