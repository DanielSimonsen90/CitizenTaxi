import { createContext } from "react";
import { AuthProviderContextType } from "./AuthProviderTypes";

export const AuthProviderContext = createContext<AuthProviderContextType<true>>({
  user: null,

  login: () => {},
  logout: () => {},
  loggingIn: false,
});