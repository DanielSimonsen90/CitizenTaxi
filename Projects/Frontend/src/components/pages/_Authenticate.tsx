import { Button } from "danholibraryrjs";
import { Role, translateEnum } from "models/backend/common/enums";
import { useAuth } from "providers/AuthProvider";
import { Request } from "utils";

/**
 * Component used to authenticate the user role.
 * @returns Appropriate view based on the user role
 */
export default function Authenticate() {
  const { login, logout, user } = useAuth();
  const username = "admin";
  const password = "admin123";

  return (
    <div>
      {!user ? <div>Not logged in</div> : <div>Logged in as {user.name}, {translateEnum(user.role)}</div>}
      <Button onClick={() => user ? logout() : login(username, password)}>{
        user ? "Logout" : "Login"
      }</Button>
      <Button onClick={async () => {
        const response = await Request(`users?role=${Role.Citizen}`);
        alert(response.status);
      }}>Request citizens</Button>
    </div>
  );
}