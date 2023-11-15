import { createContext } from "react";
import { AuthProviderContextType } from "./AuthProviderTypes";

export const AuthProviderContext = createContext<AuthProviderContextType>({
  user: undefined,

  login: () => {},
  logout: () => {},
  logginIn: false,
});

export const COOKIE_NAME = "citizen_taxi_access_token"