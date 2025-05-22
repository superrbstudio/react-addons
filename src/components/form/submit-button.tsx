import { ButtonHTMLAttributes } from 'react'
import { Button } from '../../components'

export default function SubmitButton({
  label = 'Submit',
  ...props
}: { label?: string } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <Button label={label} className="form__submit" type="submit" {...props} />
  )
}
