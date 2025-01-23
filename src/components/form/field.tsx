'use client'

import {
  FormEvent,
  FormEventHandler,
  InputHTMLAttributes,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
  useEffect,
  useState,
} from 'react'
import { AnySchema } from 'yup'
import { UseFormRegisterReturn } from 'react-hook-form'
import FileField from './file-field'

interface Props {
  register: UseFormRegisterReturn<string>
  schema: AnySchema<any>
  id?: string
  onInput?: FormEventHandler<HTMLElement>
  onChange?: FormEventHandler<HTMLElement>
}

export type InputFieldType =
  | HTMLInputElement
  | HTMLTextAreaElement
  | HTMLSelectElement

export type InputProps = InputHTMLAttributes<HTMLInputElement>
export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>
export type SelectProps = SelectHTMLAttributes<HTMLSelectElement>

export type FieldProps = InputProps | TextareaProps | SelectProps

export default function FormField({
  register,
  schema,
  id,
  onInput,
  onChange,
}: Props) {
  const [touched, setTouched] = useState<boolean>(false)
  const [rendered, setRendered] = useState<boolean>(false)
  const fieldProps: FieldProps = {
    ...register,
    ...(!touched && schema?.spec?.default
      ? { value: schema?.spec?.default }
      : {}),
    ...(id ? { id } : {}),
    ...(schema?.spec?.meta?.disabled ? { disabled: true } : {}),
    ...(schema?.spec?.meta?.multiple ? { multiple: true } : {}),
    ...(schema?.spec?.meta?.placeholder
      ? { placeholder: schema?.spec?.meta?.placeholder }
      : {}),
    ...(schema?.spec?.meta?.autocomplete
      ? { autocomplete: schema?.spec?.meta?.autocomplete }
      : {}),
    onInput: (event: FormEvent<InputFieldType>) => {
      setTouched(true)

      if (onInput) {
        onInput(event)
      }
    },
    onChange: (event: FormEvent<InputFieldType>) => {
      setTouched(true)

      if (onChange) {
        onChange(event)
      }
    },
  }

  useEffect(() => {
    setRendered(true)
  }, [])

  if (schema?.spec?.meta?.options?.length > 0) {
    return (
      <select
        className="form__control form__control--select"
        {...(fieldProps as SelectProps)}
      >
        {schema?.spec?.meta?.placeholder ? (
          <option value="" key={'placeholder'}>
            {schema?.spec?.meta?.placeholder}
          </option>
        ) : null}
        {schema?.spec?.meta?.options?.map((value: string, index: number) => (
          <option value={value} key={value}>
            {value}
          </option>
        ))}
      </select>
    )
  }

  return (
    <>
      {schema?.spec?.meta?.textarea === true ? (
        <textarea
          className="form__control"
          {...(fieldProps as TextareaProps)}
        />
      ) : schema?.type === 'boolean' ? (
        <input
          type="checkbox"
          className="form__control form__control--checkbox"
          checked={!rendered ? schema?.spec?.default : null}
          {...(fieldProps as InputProps)}
        />
      ) : schema?.type === 'date' ? (
        <input
          type="date"
          className="form__control form__control--date"
          {...(fieldProps as InputProps)}
        />
      ) : schema?.spec?.meta?.hidden === true ? (
        <input
          type="hidden"
          className="form__control form__control--hidden"
          {...(fieldProps as InputProps)}
        />
      ) : schema?.type === 'mixed' ? (
        <>
          <FileField schema={schema} {...(fieldProps as InputProps)} />
        </>
      ) : (
        <input className="form__control" {...(fieldProps as InputProps)} />
      )}
    </>
  )
}
