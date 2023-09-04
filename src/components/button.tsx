import {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ForwardedRef,
  HTMLAttributes,
  MouseEventHandler,
  MutableRefObject,
  PropsWithChildren,
  forwardRef,
  memo,
} from "react"
import Link from "next/link"
import { extendClass } from "../utils"
import { PrismicNextLink, PrismicNextLinkProps } from "@prismicio/next"

type Props = (
  | PropsWithChildren<HTMLAttributes<HTMLButtonElement | HTMLAnchorElement>>
  | ButtonHTMLAttributes<HTMLButtonElement>
  | AnchorHTMLAttributes<HTMLAnchorElement>
) & {
  label?: string
  label_a11y?: string
  onClick?: MouseEventHandler
  className?: string
  href?: string
  field?: PrismicNextLinkProps["field"]
}

const Button = forwardRef(
  (
    {
      children,
      label,
      label_a11y,
      onClick,
      className = "",
      href,
      field,
      ...props
    }: Props,
    ref: ForwardedRef<HTMLAnchorElement | HTMLButtonElement>
  ) => {
    className = `button ${className}`
    const renderedChildren = (
      <>
        {label_a11y && <span className="screenreader-text">{label_a11y}</span>}
        {label && (
          <span
            className={`${extendClass("button", "label")} ${extendClass(
              className,
              "label"
            )}`}
            aria-hidden={label_a11y !== undefined}
            data-text={label}
          >
            {label}
          </span>
        )}
        {children}
      </>
    )

    const linkProps = {
      ...props,
      onClick,
      className,
      "aria-label": label_a11y || label,
      ref,
    }

    if (href) {
      type AnchorProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
        ref: MutableRefObject<HTMLAnchorElement>
      }

      return (
        <Link {...{ ...(linkProps as AnchorProps), href }}>
          {renderedChildren}
        </Link>
      )
    }

    if (field) {
      type LinkProps = Omit<Omit<PrismicNextLinkProps, "href">, "document"> & {
        ref: MutableRefObject<HTMLAnchorElement>
      }

      return (
        <PrismicNextLink {...{ ...(linkProps as LinkProps), field }}>
          {renderedChildren}
        </PrismicNextLink>
      )
    }

    const buttonProps = {
      ...props,
      onClick,
      className,
      "aria-label": label_a11y || label,
      ref,
    } as ButtonHTMLAttributes<HTMLButtonElement> & {
      ref: MutableRefObject<HTMLButtonElement>
    }

    return <button {...buttonProps}>{renderedChildren}</button>
  }
)

export default memo(Button)
export type { Props as ButtonProps }
