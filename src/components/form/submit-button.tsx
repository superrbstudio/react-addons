import { Button } from '../../components'

const SubmitButton = ({ label }: { label?: string }) => {
  return (
    <Button label={label || 'Submit'} className="form__submit" type="submit" />
  )
}

export default SubmitButton
