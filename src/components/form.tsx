'use client'

import {
  useCallback,
  useState,
  ReactNode,
  useEffect,
  Fragment,
  forwardRef,
  MutableRefObject,
  useRef,
  ForwardedRef,
} from 'react'
import { ObjectSchema, InferType, AnySchema } from 'yup'
import { paramCase, sentenceCase } from 'change-case'
import { FieldError, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import useAsync, { Status } from '../hooks/use-async'
import { FieldRenderer } from './form/types'
import SuccessMessage from './form/success-message'
import ErrorMessage from './form/error-message'
import FormField from './form/field'
import SubmitButton from './form/submit-button'
import messages from './form/messages.json'

export interface FormProps<T extends ObjectSchema<any>> {
  schema: T
  name?: string
  action?: string
  className?: string
  method?: string
  initialData?: { [P in T as string]: any }
  onSubmit?: (data: InferType<T>) => void
  onStatusChange?: (status: Status) => void
  renderSuccessMessage?: ((data: InferType<T>) => ReactNode) | false
  renderErrorMessage?: (
    error?: FieldError,
    fieldSchema?: AnySchema,
  ) => ReactNode
  renderSubmit?: () => ReactNode
  renderers?: { [P in T as string]: FieldRenderer }
  executeRecaptcha?: () => Promise<string>
}

const toBase64 = (file: File) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      // Use a regex to remove data url part
      const base64String = reader.result
        ?.toString()
        .replace('data:', '')
        .replace(/^.+,/, '')
      resolve(base64String)
    }
    reader.readAsDataURL(file)
    reader.onerror = reject
  })

function Form(
  {
    schema,
    name,
    action,
    className,
    initialData,
    method = 'post',
    onSubmit = () => {},
    onStatusChange = () => {},
    renderSuccessMessage = (data) => <SuccessMessage />,
    renderErrorMessage = (error?: FieldError, fieldSchema?: AnySchema) => (
      <ErrorMessage error={error} fieldSchema={fieldSchema} />
    ),
    renderSubmit = () => <SubmitButton />,
    renderers = {},
    executeRecaptcha = undefined,
    ...props
  }: FormProps<ObjectSchema<any>>,
  ref: ForwardedRef<HTMLFormElement>,
) {
  type DataStructure = InferType<typeof schema>
  const [data, setData] = useState<DataStructure>({})
  const fieldRefs = useRef<{ [P in DataStructure as string]?: HTMLElement }>(
    {},
  ) as MutableRefObject<{ [P in DataStructure as string]?: HTMLElement }>

  for (const name of Object.keys(schema.fields)) {
    const field: AnySchema = schema.fields[name] as AnySchema
    if (field.spec?.meta?.options?.length > 1) {
      field.oneOf(field?.spec?.meta?.options)
    }
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DataStructure>({
    resolver: yupResolver(schema),
    defaultValues: initialData,
  })

  const onSubmitHandler = useCallback(
    async (data: DataStructure) => {
      if (onSubmit) {
        return onSubmit(data)
      }

      for (const [key, value] of Object.entries(data)) {
        if (value instanceof FileList) {
          data[`file_${key}`] = []
          for (const [fileKey, fileValue] of Object.entries(value)) {
            if (fileValue instanceof File && fileValue.size > 0) {
              const insertFile = {
                base64: await toBase64(fileValue),
                name: fileValue.name,
                type: fileValue.type,
                size: fileValue.size,
              }
              data[`file_${key}`][fileKey] = insertFile
            }
          }
        }
      }

      // if recaptcha is enabled generate a token and add to the data
      if (executeRecaptcha) {
        const token = await executeRecaptcha()
        data['recaptchaToken'] = token
      }

      const response = await fetch(action as string, {
        method: 'post',
        headers: {
          contentType: 'application/json',
        },
        body: JSON.stringify(data),
      })

      const responseData = await response.json()

      if (!response.ok) {
        if (responseData.error) {
          throw new Error(responseData.error)
        }

        throw new Error(messages.form.error.endpoint_failure)
      }

      setData(responseData)

      return responseData
    },
    [action, onSubmit],
  )

  const { execute, status, error } = useAsync(onSubmitHandler, false, [
    onSubmitHandler,
  ])

  useEffect(() => {
    if (onStatusChange) {
      onStatusChange(status)
    }
  }, [status])

  Object.keys(schema.fields).map((fieldName) => {
    const field: AnySchema = schema.fields[fieldName] as AnySchema
    if (!field?.spec?.label) {
      field.spec.label = sentenceCase(fieldName)
    }
  })

  return (
    <>
      {status === 'success' && renderSuccessMessage !== false ? (
        <>{renderSuccessMessage(data)}</>
      ) : (
        <form
          className={`form ${className}`}
          action={action}
          method={method}
          onSubmit={handleSubmit(execute)}
          noValidate={true}
          ref={ref as MutableRefObject<HTMLFormElement>}
          {...props}
        >
          {error && renderErrorMessage({ message: error } as FieldError)}

          {Object.keys(schema.fields).map((fieldName, key) => {
            const field: AnySchema = schema.fields[fieldName] as AnySchema

            return (
              <Fragment key={key}>
                {field?.spec?.meta?.hidden === true ? (
                  <FormField register={register(fieldName)} schema={field} />
                ) : (
                  <div
                    className={`form__group form__group--${paramCase(
                      fieldName,
                    )} ${fieldName in errors ? 'form__group--error' : ''} ${
                      field?.type === 'boolean' ? 'form__group--checkbox' : ''
                    }`}
                    ref={(ref) => {
                      fieldRefs.current[fieldName] = ref as HTMLElement
                    }}
                  >
                    <label
                      className="form__label"
                      htmlFor={`${name}__${paramCase(fieldName)}`}
                    >
                      <span
                        className="form__label-text"
                        dangerouslySetInnerHTML={{
                          __html: `${field?.spec?.label} ${
                            !field?.spec?.optional ? '*' : ''
                          }`,
                        }}
                      />

                      {fieldName in renderers ? (
                        renderers[fieldName](
                          register(fieldName),
                          errors[fieldName] as FieldError,
                          field,
                        )
                      ) : (
                        <>
                          <FormField
                            register={register(fieldName)}
                            id={`${name}__${paramCase(fieldName)}`}
                            schema={field}
                            onInput={(event) => {
                              fieldRefs.current[fieldName]?.classList.add(
                                'form__group--filled',
                              )
                            }}
                          />
                          {fieldName in errors &&
                            renderErrorMessage(
                              errors[fieldName] as FieldError,
                              field,
                            )}
                        </>
                      )}
                    </label>
                  </div>
                )}
              </Fragment>
            )
          })}

          {renderSubmit()}
        </form>
      )}
    </>
  )
}

export default forwardRef(Form)
