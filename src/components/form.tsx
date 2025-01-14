'use client'

import {
  useState,
  ReactNode,
  useEffect,
  Fragment,
  forwardRef,
  MutableRefObject,
  useRef,
  ForwardedRef,
  useCallback,
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
// import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import ApiResponse from '@/types/api-response'
import {
  GoogleReCaptchaProvider,
  useGoogleReCaptcha,
} from 'react-google-recaptcha-v3'

export interface FormProps<T extends ObjectSchema<any>> {
  schema: T
  name?: string
  action?: string | ((data: InferType<T>, token: string) => any)
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
  useRecaptcha?: boolean
}

function toBase64(file: File) {
  return new Promise((resolve, reject) => {
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
}

const FormInner = forwardRef(function FormInner(
  {
    schema,
    name,
    action,
    className,
    initialData,
    onSubmit,
    method,
    onStatusChange = () => {},
    renderSuccessMessage = (data) => <SuccessMessage />,
    renderErrorMessage = (error?: FieldError, fieldSchema?: AnySchema) => (
      <ErrorMessage error={error} fieldSchema={fieldSchema} />
    ),
    renderSubmit = () => <SubmitButton />,
    renderers = {},
    useRecaptcha = true,
    ...props
  }: FormProps<ObjectSchema<any>>,
  ref: ForwardedRef<HTMLFormElement>,
) {
  type DataStructure = InferType<typeof schema> & { recaptchaToken?: string }
  const [data, setData] = useState<DataStructure>({})
  const fieldRefs = useRef<{ [P in DataStructure as string]?: HTMLElement }>(
    {},
  ) as MutableRefObject<{ [P in DataStructure as string]?: HTMLElement }>
  const { executeRecaptcha } = useGoogleReCaptcha()

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

      // if recaptcha is enabled generate a token and add to the data
      if (useRecaptcha && executeRecaptcha) {
        const token = await executeRecaptcha()
        data['recaptchaToken'] = token
      }

      // Intercept submissions for Next server actions
      if (typeof action === 'function') {
        const { recaptchaToken, ...formData } = data
        return action(formData, recaptchaToken)
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

      const response = await fetch(action as string, {
        method: 'post',
        headers: {
          contentType: 'application/json',
        },
        body: JSON.stringify(data),
      })

      const responseData: ApiResponse = await response.json()

      if (!response.ok || !responseData.success) {
        if (responseData.error) {
          throw new Error(responseData.error)
        }

        throw new Error(messages.form.error.endpoint_failure)
      }

      setData(responseData)

      return responseData
    },
    [action, onSubmit, useRecaptcha, executeRecaptcha],
  )

  const { execute, status, error } = useAsync(onSubmitHandler, false, [
    onSubmitHandler,
  ])

  useEffect(() => {
    if (onStatusChange) {
      onStatusChange(status)
    }
  }, [status, onStatusChange])

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
          action={action as string}
          {...(method ? { method } : {})}
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
                            !field?.spec?.optional
                              ? '<span class="form__required-indicator">*</span>'
                              : ''
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

          {useRecaptcha && (
            <p className="form__recaptcha-message">
              This site is protected by reCAPTCHA and the Google{' '}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener"
              >
                Privacy Policy
              </a>{' '}
              and{' '}
              <a
                href="https://policies.google.com/terms"
                target="_blank"
                rel="noopener"
              >
                Terms of Service
              </a>{' '}
              apply.
            </p>
          )}
        </form>
      )}
    </>
  )
})

function Form<T extends any>(
  props: FormProps<ObjectSchema<any>>,
  ref: ForwardedRef<HTMLFormElement>,
) {
  if (props.useRecaptcha === false) {
    return <FormInner {...props} ref={ref} />
  }

  const key = process.env.NEXT_PUBLIC_RECAPTCHA_KEY as string
  if (!key) {
    throw new Error('Env var NEXT_PUBLIC_RECAPTCHA_KEY is not set')
  }

  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_KEY as string}
    >
      <FormInner {...props} ref={ref} />
    </GoogleReCaptchaProvider>
  )
}

export default forwardRef(Form)
