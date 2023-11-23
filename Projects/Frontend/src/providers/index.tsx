import { PropsWithChildren } from "react";
import AuthProvider from "./AuthProvider";
import NotificationProvider from "./NotificationProvider";


export default function Providers({ children }: PropsWithChildren) {
  return (
    <NotificationProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </NotificationProvider>
  );
}