import { Button } from '../../components'

export default function SubmitButton({ label }: { label?: string }) {
  return (
    <Button label={label || 'Submit'} className="form__submit" type="submit" />
  )
}
