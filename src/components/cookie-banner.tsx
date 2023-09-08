"use client"

import { useContext, useState } from "react"
import { CookiesContext } from "../context"
import { Button, Form } from "../components"
import * as Yup from "yup"
import SubmitButton from "./form/submit-button"
import { session } from "../storage"

const content = {
  title: "Cookie Notice",
  text: "We use cookies to ensure you get the best experience on our website.",
  form_text: "Select the type of cookies you wish to allow.",
  policyLink: "/legal/cookies-policy",
  policyLabel: "Cookie Policy",
  customiseLabel: "Customise",
  rejectLabel: "Reject",
  acceptLabel: "Accept",
  acceptAllLabel: "Accept All",
  tracking: {
    title: "Optional Cookies",
    description:
      "These cookies are set by third-parties to track browsing habits in order to personalise your experience.",
  },
  necessary: {
    title: "Necessary Cookies",
    description:
      "These cookies are necessary for the website to function and cannot be switched off.",
  },
}

const CookieBanner = ({
  allowCustomisation = true,
  allowReject = false,
  title = content.title,
  text = content.text,
  formText = content.form_text,
  policyLink = content.policyLink,
  policyLabel = content.policyLabel,
}: {
  allowCustomisation?: boolean
  allowReject?: boolean
  title?: string
  text?: string
  formText?: string
  policyLink?: string
  policyLabel?: string
}) => {
  const { cookiesAccepted, setCookiesAccepted, setTrackingCookiesAccepted } =
    useContext(CookiesContext)
  const [animate, setAnimate] = useState<boolean>(false)
  const [formOpen, setFormOpen] = useState<boolean>(false)
  const [rejected, setRejected] = useState<boolean>(
    !!session.getItem("cookies-rejected")
  )

  const openForm = () => {
    setFormOpen(true)
  }

  const reject = () => {
    setRejected(true)
    session.setItem("cookies-rejected", "true")
  }

  const accept = (necessary: boolean, tracking: boolean) => {
    setAnimate(true)
    setTimeout(() => {
      setCookiesAccepted(necessary)
      setTrackingCookiesAccepted(tracking)
    }, 800)
  }

  const acceptAll = () => {
    accept(true, true)
  }

  const submit = (data: { [key: string]: boolean }) => {
    accept(true, !!data.tracking)
  }

  const acceptLabel =
    !allowCustomisation || formOpen
      ? content.acceptLabel
      : content.acceptAllLabel

  const schema = Yup.object().shape({
    tracking: Yup.boolean().required().default(true).label(`
      <strong>${content.tracking?.title}</strong>
      <p>${content.tracking?.description}</p>
    `),
    necessary: Yup.boolean()
      .required()
      .default(true)
      .label(
        `
        <strong>${content.necessary?.title}</strong>
        <p>${content.necessary?.description}</p>
      `
      )
      .meta({ disabled: true }),
  })

  return (
    <>
      {!rejected && !cookiesAccepted ? (
        <div
          className={`cookie-banner ${animate ? " cookie-banner--hide" : ""} `}
        >
          <div className="cookie-banner__container container">
            <div className="cookie-banner__inner">
              {allowCustomisation && (
                <div className="cookie-banner__form" aria-hidden={!formOpen}>
                  {formText && (
                    <p className="cookie-banner__form-text">{formText}</p>
                  )}
                  <Form
                    className="cookie-banner__form"
                    schema={schema}
                    onSubmit={submit}
                    renderSubmit={() => <SubmitButton label={acceptLabel} />}
                    renderSuccessMessage={false}
                  />
                </div>
              )}
              <div className="cookie-banner__main">
                <div className="cookie-banner__message" aria-hidden={formOpen}>
                  {title && <h2 className="cookie-banner__title">{title}</h2>}
                  {text && (
                    <p className="cookie-banner__text">
                      {text} <a href={policyLink}>{policyLabel}</a>
                    </p>
                  )}
                </div>
                <div className="cookie-banner__buttons">
                  {allowReject && !allowCustomisation && !formOpen && (
                    <Button
                      onClick={reject}
                      className="cookie-banner__reject button button__rounded button__rounded--black-fill"
                      label={content.rejectLabel}
                    />
                  )}
                  {allowCustomisation && !formOpen && (
                    <Button
                      onClick={openForm}
                      className="cookie-banner__reject button button__rounded button__rounded--black-fill"
                      label={content.customiseLabel}
                    />
                  )}
                  {!formOpen && (
                    <Button
                      onClick={acceptAll}
                      className="cookie-banner__agree button button__rounded button__rounded--black"
                      label={acceptLabel}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  )
}

export default CookieBanner
