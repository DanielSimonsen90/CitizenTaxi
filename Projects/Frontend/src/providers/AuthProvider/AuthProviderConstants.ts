import { createContext } from "react";
import { AuthProviderContextType } from "./AuthProviderTypes";

export const AuthProviderContext = createContext<AuthProviderContextType>({
  user: undefined,

  login: () => {},
  logout: () => {},
  loggingIn: false,
});