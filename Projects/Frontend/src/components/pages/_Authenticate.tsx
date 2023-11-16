import { Role } from "models/backend/common/enums";
import { useAuth } from "providers/AuthProvider";
import { AdminPage, CitizenPage, LoginPage } from '.'
import NotFound from "./NotFound/NotFound";
import { useSearchParams } from "react-router-dom";
import { useUpdateEffect } from "danholibraryrjs";

/**
 * Component used to authenticate the user role.
 * @returns Appropriate view based on the user role
 */
export default function Authenticate() {
  const { user } = useAuth();
  const setParams = useSearchParams()[1];

  useUpdateEffect(() => {
    setParams();
  }, [user])

  return !user ? <LoginPage /> 
    : user.role === Role.Citizen ? <CitizenPage /> 
    : user.role === Role.Admin ? <AdminPage /> 
    : <NotFound />
}