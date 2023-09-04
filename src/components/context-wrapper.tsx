import { PropsWithChildren } from "react"
import { ModalContextProvider, NavContextProvider } from "../context"

const ContextWrapper = ({ children }: PropsWithChildren<{}>) => (
  <ModalContextProvider>
    <NavContextProvider>{children}</NavContextProvider>
  </ModalContextProvider>
)

export default ContextWrapper
