import { PropsWithChildren } from "react";

/**
 * Component used to authenticate the user role.
 * @param props
 * @returns Appropriate view based on the user role
 */
export default function Authenticate({ children }: PropsWithChildren) {
  // TODO: Add authentication logic

  return <>{children}</>
}