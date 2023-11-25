import { PropsWithChildren } from "react";
import AuthProvider from "./AuthProvider";


export default function Providers({ children }: PropsWithChildren) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}