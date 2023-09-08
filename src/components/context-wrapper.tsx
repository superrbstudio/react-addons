import { PropsWithChildren } from "react"
import {
  CookiesContextProvider,
  ModalContextProvider,
  NavContextProvider,
} from "../context"

const ContextWrapper = ({ children }: PropsWithChildren<{}>) => (
  <CookiesContextProvider>
    <ModalContextProvider>
      <NavContextProvider>{children}</NavContextProvider>
    </ModalContextProvider>
  </CookiesContextProvider>
)

export default ContextWrapper
