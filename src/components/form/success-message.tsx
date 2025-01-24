'use client'

import { useEffect, useRef } from 'react'

export default function SuccessMessage({
  data,
}: {
  data: Record<string, any>
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  return (
    <div className="success-message" ref={ref}>
      <h2 className="success-message__title">Thanks for your message</h2>
      <p className="success-message__text">
        We'll get back to you as soon as possible.
      </p>
    </div>
  )
}
