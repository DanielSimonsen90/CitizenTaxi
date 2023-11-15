import { Button } from "danholibraryrjs";
import { Role } from "models/backend/common";
import { useAuth } from "providers/AuthProvider";
import { Request } from "utils";

/**
 * Component used to authenticate the user role.
 * @returns Appropriate view based on the user role
 */
export default function Authenticate() {
  const { login } = useAuth();
  const username = "admin";
  const password= "admin123";

  return (
    <div>
      <Button onClick={() => login(username, password)}>Login</Button>
      <Button onClick={async () => {
        const response = await Request(`users?role=${Role.Citizen}`);
        console.log(response);
        alert(response.status);
      }}>Get Citizens</Button>
    </div>
  )
}