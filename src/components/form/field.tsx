'use client'

import {
  ChangeEvent,
  ChangeEventHandler,
  ForwardedRef,
  forwardRef,
  InputEvent,
  InputEventHandler,
  InputHTMLAttributes,
  RefObject,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
  useState,
} from 'react'
import { AnySchema } from 'yup'
import { UseFormRegisterReturn } from 'react-hook-form'
import FileField from './file-field'
import { InputMask } from '@react-input/mask'

export type InputFieldType =
  | HTMLInputElement
  | HTMLTextAreaElement
  | HTMLSelectElement

interface Props {
  register: UseFormRegisterReturn<string>
  schema: AnySchema<any>
  id?: string
  onInput?: InputEventHandler<InputFieldType>
  onChange?: ChangeEventHandler<InputFieldType>
  value?: any
  disabled?: boolean
}

export type InputProps = InputHTMLAttributes<HTMLInputElement>
export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>
export type SelectProps = SelectHTMLAttributes<HTMLSelectElement>

export type FieldProps = InputProps | TextareaProps | SelectProps

function FormField(
  { register, schema, id, onInput, onChange, value, disabled = false }: Props,
  ref: ForwardedRef<InputFieldType>,
) {
  const [touched, setTouched] = useState<boolean>(false)
  const fieldProps: FieldProps = {
    ...register,
    ...(value
      ? { value }
      : !touched && schema?.spec?.default
        ? { value: schema?.spec?.default }
        : {}),
    ...(id ? { id } : {}),
    ...(disabled || schema?.spec?.meta?.disabled ? { disabled: true } : {}),
    ...(schema?.spec?.meta?.multiple ? { multiple: true } : {}),
    ...(schema?.spec?.meta?.placeholder
      ? { placeholder: schema?.spec?.meta?.placeholder }
      : {}),
    ...(schema?.spec?.meta?.autocomplete
      ? { autocomplete: schema?.spec?.meta?.autocomplete }
      : {}),
    onInput: (event: InputEvent<InputFieldType>) => {
      setTouched(true)

      if (onInput) {
        onInput(event)
      }
    },
    onChange: (event: ChangeEvent<InputFieldType>) => {
      setTouched(true)

      if (onChange) {
        onChange(event)
      }
    },
  }

  if (schema?.spec?.meta?.options?.length > 0) {
    return (
      <select
        className="form__control form__control--select"
        {...(fieldProps as SelectProps)}
        ref={ref as RefObject<HTMLSelectElement>}
      >
        {schema?.spec?.meta?.placeholder ? (
          <option value="" key={'placeholder'}>
            {schema?.spec?.meta?.placeholder}
          </option>
        ) : null}
        {schema?.spec?.meta?.options?.map(
          (
            optionValue: string | { value: string; label: string },
            index: number,
          ) => {
            if (typeof optionValue === 'string') {
              return (
                <option value={optionValue} key={optionValue}>
                  {optionValue}
                </option>
              )
            }

            return (
              <option value={optionValue.value} key={optionValue.value}>
                {optionValue.label}
              </option>
            )
          },
        )}
      </select>
    )
  }

  return (
    <>
      {schema?.spec?.meta?.hidden === true ? (
        <input
          type="hidden"
          className="form__control form__control--hidden"
          {...(fieldProps as InputProps)}
          ref={ref as RefObject<HTMLInputElement>}
        />
      ) : schema?.spec?.meta?.textarea === true ? (
        <textarea
          className="form__control"
          {...(fieldProps as TextareaProps)}
          ref={ref as RefObject<HTMLTextAreaElement>}
        />
      ) : schema?.type === 'boolean' ? (
        <input
          type="checkbox"
          className="form__control form__control--checkbox"
          defaultChecked={schema?.spec?.default}
          {...(fieldProps as InputProps)}
          ref={ref as RefObject<HTMLInputElement>}
        />
      ) : schema?.type === 'date' ? (
        <input
          type="date"
          className="form__control form__control--date"
          {...({
            ...fieldProps,
            value:
              fieldProps.value && fieldProps.value instanceof Date
                ? fieldProps.value.toISOString().split('T')[0]
                : fieldProps.value,
          } as InputProps)}
          ref={ref as RefObject<HTMLInputElement>}
        />
      ) : schema?.type === 'mixed' ? (
        <>
          <FileField
            schema={schema}
            {...(fieldProps as InputProps)}
            ref={ref as RefObject<HTMLInputElement>}
          />
        </>
      ) : schema?.spec?.meta?.mask ? (
        <InputMask
          mask={schema?.spec?.meta?.mask}
          replacement={schema?.spec?.meta?.maskReplacement || '_'}
          className="form__control"
          {...(fieldProps as InputProps)}
          ref={ref as RefObject<HTMLInputElement>}
        />
      ) : (
        <input
          className="form__control"
          {...(fieldProps as InputProps)}
          ref={ref as RefObject<HTMLInputElement>}
        />
      )}
    </>
  )
}

export default forwardRef(FormField)
