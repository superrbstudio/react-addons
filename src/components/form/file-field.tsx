import { AnySchema } from 'yup'
import { InputProps } from './field'
import {
  FormEvent,
  ForwardedRef,
  forwardRef,
  MutableRefObject,
  useState,
} from 'react'

interface Props extends InputProps {
  schema: AnySchema<any>
}

interface File {
  url: string
  name: string
}

export function Files({ files }: { files: File[] }) {
  return (
    <ul className="form__file-list">
      {files.map((file) => (
        <li key={file.name} className="form__file-list-item">
          <figure className="form__file-list-image">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={file.url} alt={file.name} />
          </figure>
          <a
            href={file.url}
            download={file.name}
            className="form__file-list-name"
          >
            {file.name}
          </a>
        </li>
      ))}
    </ul>
  )
}

function FileField(
  { schema, ...fieldProps }: Props,
  ref: ForwardedRef<HTMLInputElement>,
) {
  const [files, setFiles] = useState<File[]>([])

  const originalOnInput = fieldProps.onInput
  fieldProps.onInput = (event: FormEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement
    const newFiles = Array.from(target.files || []).map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
    }))
    setFiles(newFiles)

    if (originalOnInput) {
      originalOnInput(event)
    }
  }

  const input = (
    <>
      <input
        className="form__control form__control--mixed"
        type="file"
        {...fieldProps}
        ref={ref as MutableRefObject<HTMLInputElement>}
      />
    </>
  )

  return (
    <fieldset className="form__file-upload-wrapper">
      {input}
      <Files files={files} />
    </fieldset>
  )
}

export default forwardRef(FileField)
