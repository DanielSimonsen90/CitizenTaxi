import { useContext } from "react";
import { AuthProviderContext } from "./AuthProviderConstants";

export const useAuth = () => useContext(AuthProviderContext);