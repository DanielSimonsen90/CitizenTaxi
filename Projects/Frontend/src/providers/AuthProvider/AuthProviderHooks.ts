import { useContext } from "react";
import { AuthProviderContext } from "./AuthProviderConstants";
import { AuthProviderContextType,  } from "./AuthProviderTypes";

export function useAuth<
  AllowNullable extends boolean
>(allowNullable: AllowNullable = true as AllowNullable): AuthProviderContextType<AllowNullable> {
  return useContext(AuthProviderContext) as AuthProviderContextType<AllowNullable>;
}