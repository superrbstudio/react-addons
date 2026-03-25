import { kebabCase } from 'change-case'
import { AnySchema, ObjectSchema } from 'yup'
import { FieldRenderer } from './types'
import { FieldError, FieldErrors, Path, UseFormRegister } from 'react-hook-form'
import FormField, { InputFieldType } from './field'
import { Fragment, InputEvent, ReactNode, RefObject } from 'react'

type Props<DataStructure> = {
  className?: string
  schema: ObjectSchema<any>
  name: string
  renderers: Record<string, FieldRenderer>
  errors: FieldErrors
  disabled: boolean
  register: UseFormRegister<any>
  fieldRefs: RefObject<Map<keyof DataStructure, InputFieldType>>
  handleInput: (
    event: InputEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void
  setValue: (name: Path<DataStructure>, value: any) => void
  renderErrorMessage: (error: FieldError, field: AnySchema) => ReactNode
}

export default function Fieldset<DataStructure>({
  className,
  schema,
  name,
  renderers,
  errors,
  disabled,
  register,
  fieldRefs,
  handleInput,
  setValue,
  renderErrorMessage,
}: Props<DataStructure>) {
  return (
    <fieldset className={`form__fieldset form__fieldset--${kebabCase(name)}`}>
      <legend className="form__legend">{schema?.spec?.label || name}</legend>

      {Object.keys(schema.fields).map((childName: string, key) => {
        const field: AnySchema = schema.fields[childName as string] as AnySchema
        const fieldName = `${name}[${childName}]`

        const onInput = (event: InputEvent<InputFieldType>) => {
          const field = fieldRefs.current.get(fieldName as keyof DataStructure)
          const group = field?.closest('.form__group')

          const fn = (field?.value?.length || 0) > 0 ? 'add' : 'remove'
          group?.classList[fn]('form__group--filled')

          setValue(fieldName as Path<DataStructure>, field?.value as any)
          handleInput(event as InputEvent<InputFieldType>)
        }

        return (
          <Fragment key={key}>
            {field?.spec?.meta?.hidden === true ? (
              <FormField
                register={register(fieldName as Path<DataStructure>)}
                schema={field}
                onInput={onInput}
                disabled={disabled}
                ref={(ref) => {
                  fieldRefs.current.set(
                    fieldName as keyof DataStructure,
                    ref as InputFieldType,
                  )
                }}
              />
            ) : (
              <div
                className={`form__group form__group--${kebabCase(
                  fieldName as string,
                )} ${fieldName in errors ? 'form__group--error' : ''} ${
                  field?.type === 'boolean' ? 'form__group--checkbox' : ''
                } ${field?.type === 'date' ? 'form__group--date' : ''}`}
              >
                <label
                  className="form__label"
                  htmlFor={`${name}__${kebabCase(fieldName as string)}`}
                >
                  <span
                    className={`form__label-text ${field?.spec?.meta?.hiddenLabel ? 'screenreader-text' : ''}`}
                    data-label={`${field?.spec?.meta?.buttonLabel ? field?.spec?.meta?.buttonLabel : field?.spec?.label}`}
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
                        register={register(fieldName as Path<DataStructure>)}
                        id={`${name}__${kebabCase(fieldName as string)}`}
                        schema={field}
                        onInput={onInput}
                        onChange={onInput}
                        disabled={disabled}
                        ref={(ref) => {
                          fieldRefs.current.set(
                            fieldName as keyof DataStructure,
                            ref as InputFieldType,
                          )
                        }}
                      />
                      {fieldName in errors &&
                        renderErrorMessage(
                          errors[fieldName] as FieldError,
                          field,
                        )}

                      {field.spec?.meta?.help && (
                        <p className="form__help">{field.spec.meta.help}</p>
                      )}
                    </>
                  )}
                </label>
              </div>
            )}
          </Fragment>
        )
      })}
    </fieldset>
  )
}
