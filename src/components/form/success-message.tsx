export default function SuccessMessage({
  data,
}: {
  data: Record<string, any>
}) {
  return (
    <div className="success-message">
      <h2 className="success-message__title">Thanks for your message</h2>
      <p className="success-message__text">
        We'll get back to you as soon as possible.
      </p>
    </div>
  )
}
