'use client'

import { FormEvent, FormEventHandler, useEffect, useState } from 'react'
import { AnySchema } from 'yup'
import { UseFormRegisterReturn } from 'react-hook-form'

interface Props {
  register: UseFormRegisterReturn<string>
  schema: AnySchema<any>
  id?: string
  onInput?: FormEventHandler<HTMLElement>
}

const FormField = ({ register, schema, id, onInput }: Props) => {
  const [touched, setTouched] = useState<boolean>(false)
  const [rendered, setRendered] = useState<boolean>(false)
  const fieldProps = {
    ...register,
    ...(!touched && schema?.spec?.default
      ? { value: schema?.spec?.default }
      : {}),
    ...(id ? { id } : {}),
    ...(schema?.spec?.meta?.disabled ? { disabled: true } : {}),
    ...(schema?.spec?.meta?.placeholder
      ? { placeholder: schema?.spec?.meta?.placeholder }
      : {}),
    ...(schema?.spec?.meta?.autocomplete
      ? { autocomplete: schema?.spec?.meta?.autocomplete }
      : {}),
    onInput: (event: FormEvent<HTMLElement>) => {
      setTouched(true)

      if (onInput) {
        onInput(event)
      }
    },
  }

  useEffect(() => {
    setRendered(true)
  }, [])

  if (schema?.spec?.meta?.options?.length > 0) {
    return (
      <select className="form__control form__control--select" {...fieldProps}>
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
        <textarea className="form__control" {...fieldProps} />
      ) : schema?.type === 'boolean' ? (
        <input
          type="checkbox"
          className="form__control form__control--checkbox"
          checked={!rendered ? schema?.spec?.default : null}
          {...fieldProps}
        />
      ) : schema?.spec?.meta?.hidden === true ? (
        <input
          type="hidden"
          className="form__control form__control--hidden"
          {...fieldProps}
        />
      ) : schema?.type === 'mixed' ? (
        <input
          className="form__control form__control--mixed"
          type="file"
          {...fieldProps}
        />
      ) : (
        <input className="form__control" {...fieldProps} />
      )}
    </>
  )
}

export default FormField
