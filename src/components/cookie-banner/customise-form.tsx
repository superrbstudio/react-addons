'use client'

import { ReactNode, useMemo } from 'react'
import * as Yup from 'yup'
import Form from '../form'
import SubmitButton from '../form/submit-button'

export default function CustomiseForm({
  tracking,
  necessary,
  trackingCookiesAccepted,
  acceptLabel,
  onSubmit,
  renderSubmitButton,
}: {
  tracking?: { [key: string]: string }
  necessary?: { [key: string]: string }
  trackingCookiesAccepted: boolean
  acceptLabel?: string
  onSubmit: (data: { [key: string]: boolean }) => void
  renderSubmitButton?: () => ReactNode
}) {
  const schema = useMemo(
    () =>
      Yup.object().shape({
        tracking: Yup.boolean().required().default(trackingCookiesAccepted)
          .label(`
      <strong>${tracking?.title}</strong>
      <p>${tracking?.description}</p>
    `),
        necessary: Yup.boolean()
          .required()
          .default(true)
          .label(
            `
        <strong>${necessary?.title}</strong>
        <p>${necessary?.description}</p>
      `,
          )
          .meta({ disabled: true }),
      }),
    [
      trackingCookiesAccepted,
      tracking?.title,
      tracking?.description,
      necessary?.title,
      necessary?.description,
    ],
  )

  return (
    <Form
      className="cookie-banner__form"
      schema={schema}
      onSubmit={onSubmit}
      renderSubmit={() =>
        renderSubmitButton ? (
          renderSubmitButton()
        ) : (
          <SubmitButton label={acceptLabel} />
        )
      }
      renderSuccessMessage={false}
    />
  )
}
