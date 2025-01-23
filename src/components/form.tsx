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
  useImperativeHandle,
  FormEvent,
} from 'react'
import { ObjectSchema, InferType, AnySchema } from 'yup'
import { paramCase, sentenceCase } from 'change-case'
import { DefaultValues, FieldError, Path, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import useAsync, { Status } from '../hooks/use-async'
import { FieldRenderer } from './form/types'
import SuccessMessage from './form/success-message'
import ErrorMessage from './form/error-message'
import FormField, { InputFieldType } from './form/field'
import SubmitButton from './form/submit-button'
import messages from './form/messages.json'
// import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import ApiResponse from '@/types/api-response'
import {
  GoogleReCaptchaProvider,
  useGoogleReCaptcha,
} from 'react-google-recaptcha-v3'

type WithRecaptcha<T> = T & { recaptchaToken?: string }

export interface FormProps<
  T extends ObjectSchema<any>,
  DataStructure extends InferType<T> = InferType<T>,
> {
  schema: T
  name?: string
  action?: any
  className?: string
  method?: string
  initialData?: { [P in T as string]: any }
  onSubmit?: (data: InferType<T>) => void
  onChange?: (data: InferType<T>) => void
  onStatusChange?: (status: Status) => void
  renderSuccessMessage?: ((data: InferType<T>) => ReactNode) | false
  renderErrorMessage?: (
    error?: FieldError,
    fieldSchema?: AnySchema,
  ) => ReactNode
  renderSubmit?: () => ReactNode
  renderers?: { [P in DataStructure]: FieldRenderer }
  useRecaptcha?: boolean
}

export interface FormRef<
  T extends ObjectSchema<any>,
  DataStructure extends InferType<T> = InferType<T>,
> {
  form: HTMLFormElement
  submit: () => void
  reset: () => void
  values: WithRecaptcha<DataStructure>
  fields: {
    [P in DataStructure as string]?: HTMLElement
  }
}

const FormInner = forwardRef(function FormInner<
  T extends ObjectSchema<any>,
  DataStructure extends InferType<T> = InferType<T>,
>(
  {
    schema,
    name,
    action,
    className = '',
    initialData = {} as DataStructure,
    onSubmit,
    onChange = () => {},
    method,
    onStatusChange = () => {},
    renderSuccessMessage = (data: DataStructure) => <SuccessMessage />,
    renderErrorMessage = (error?: FieldError, fieldSchema?: AnySchema) => (
      <ErrorMessage error={error} fieldSchema={fieldSchema} />
    ),
    renderSubmit = () => <SubmitButton />,
    renderers = {} as {
      [P in DataStructure]: FieldRenderer
    },
    useRecaptcha = true,
    ...props
  }: FormProps<T>,
  ref: ForwardedRef<FormRef<T>>,
) {
  const [response, setResponse] = useState<ApiResponse>()
  const formRef = useRef<HTMLFormElement>()
  const fieldRefs = useRef<Map<keyof DataStructure, HTMLElement>>(
    new Map<keyof DataStructure, HTMLElement>(),
  ) as MutableRefObject<Map<keyof DataStructure, HTMLElement>>
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
    getValues,
    reset,
  } = useForm<WithRecaptcha<DataStructure>>({
    resolver: yupResolver(schema),
    defaultValues: initialData as DefaultValues<DataStructure>,
    mode: 'onSubmit',
  })

  useImperativeHandle(ref, () => ({
    form: formRef.current as HTMLFormElement,
    submit() {
      handleSubmit(execute)()
    },
    reset() {
      setResponse({} as ApiResponse)
      reset
    },
    get values() {
      return getValues()
    },
    fields: [...fieldRefs.current.entries()].reduce(
      (refs, [key, value]) => ({
        ...refs,
        [key]: value,
      }),
      {} as {
        [P in DataStructure as string]?: HTMLElement
      },
    ),

    errors,
    response,
  }))

  const handleInput = (
    event: FormEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const element = event.target as
      | HTMLInputElement
      | HTMLTextAreaElement
      | HTMLSelectElement
    onChange({
      ...getValues(),
      [element.name]: element.value,
    })
  }

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
        const formData = new FormData(formRef.current)
        formData.set('recaptchaToken', data.recaptchaToken)
        return action(formData)
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

      setResponse(responseData)

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
        <>{renderSuccessMessage(getValues())}</>
      ) : (
        <form
          className={`form ${className}`}
          action={action}
          {...(method ? { method } : {})}
          onSubmit={handleSubmit(execute)}
          noValidate={true}
          ref={formRef as MutableRefObject<HTMLFormElement>}
          {...props}
        >
          {error && renderErrorMessage({ message: error } as FieldError)}

          {Object.keys(schema.fields).map(
            (fieldName: keyof DataStructure, key) => {
              const field: AnySchema = schema.fields[fieldName] as AnySchema

              const onInput = (event: FormEvent<InputFieldType>) => {
                const field = fieldRefs.current.get(fieldName)
                const el: InputFieldType | undefined =
                  field?.querySelector('input, textarea, select') || undefined

                const fn = (el?.value?.length || 0) > 0 ? 'add' : 'remove'
                field?.classList[fn]('form__group--filled')

                handleInput(event as FormEvent<InputFieldType>)
              }

              return (
                <Fragment key={key}>
                  {field?.spec?.meta?.hidden === true ? (
                    <FormField
                      register={register(fieldName as Path<DataStructure>)}
                      schema={field}
                      onInput={handleInput}
                    />
                  ) : (
                    <div
                      className={`form__group form__group--${paramCase(
                        fieldName as string,
                      )} ${fieldName in errors ? 'form__group--error' : ''} ${
                        field?.type === 'boolean' ? 'form__group--checkbox' : ''
                      } ${field?.type === 'date' ? 'form__group--date' : ''}`}
                      ref={(ref) => {
                        fieldRefs.current.set(fieldName, ref as HTMLElement)
                      }}
                    >
                      <label
                        className="form__label"
                        htmlFor={`${name}__${paramCase(fieldName as string)}`}
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
                            register(fieldName as Path<DataStructure>),
                            errors[fieldName] as FieldError,
                            field,
                          )
                        ) : (
                          <>
                            <FormField
                              register={register(
                                fieldName as Path<DataStructure>,
                              )}
                              id={`${name}__${paramCase(fieldName as string)}`}
                              schema={field}
                              onInput={onInput}
                              onChange={onInput}
                            />
                            {fieldName in errors &&
                              renderErrorMessage(
                                errors[fieldName] as FieldError,
                                field,
                              )}

                            {field.spec?.meta?.help && (
                              <p className="form__help">
                                {field.spec.meta.help}
                              </p>
                            )}
                          </>
                        )}
                      </label>
                    </div>
                  )}
                </Fragment>
              )
            },
          )}

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

function Form<T extends ObjectSchema<any>>(
  props: FormProps<T>,
  ref: ForwardedRef<FormRef<T>>,
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
