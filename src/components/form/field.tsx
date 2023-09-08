"use client"

import { useEffect, useState } from "react"
import { AnySchema } from "yup"
import { UseFormRegisterReturn } from "react-hook-form"

interface Props {
  register: UseFormRegisterReturn<string>
  schema: AnySchema<any>
  id?: string
}

const FormField = ({ register, schema, id }: Props) => {
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
    onInput: () => {
      setTouched(true)
    },
  }

  useEffect(() => {
    setRendered(true)
  }, [])

  console.log(schema)

  /**
   * TODO: Find a way to make select boxes work without accessing protected `_whitelist` property
   */
  // if (schema?._whitelist?.list?.size > 0) {
  //   return (
  //     <select className="form__control form__control--select" {...fieldProps}>
  //       {schema?.spec?.meta?.placeholder ? (
  //         <option value="" key={"placeholder"}>
  //           {schema?.spec?.meta?.placeholder}
  //         </option>
  //       ) : null}
  //       {[...schema?._whitelist?.list?.entries()].map(([value, label], key) => (
  //         <option value={value as string} key={key}>
  //           {label as string}
  //         </option>
  //       ))}
  //     </select>
  //   )
  // }

  return (
    <>
      {schema?.spec?.meta?.textarea === true ? (
        <textarea className="form__control" {...fieldProps} />
      ) : schema?.type === "boolean" ? (
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
      ) : schema?.type === "mixed" ? (
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
