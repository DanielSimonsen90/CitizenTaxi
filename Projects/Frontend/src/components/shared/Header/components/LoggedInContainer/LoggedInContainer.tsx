import { Button } from "danholibraryrjs";
import { useAuth } from "providers/AuthProvider";
import { translateEnum } from "utils";

export default function LoggedInContainer() {
  const { loggingIn, user, logout } = useAuth();
  
  return (
    <div className="login-container" data-logged-in={!!user}>
      {loggingIn && <p>Logger ind...</p>}
      {user && (<>
        <p>
          Du er logget ind som
          <span className="user-name">{user.name}</span>
          <span className="user-role" title={`Du er ${translateEnum(user.role)} på siden`}>{translateEnum(user.role)}</span>
        </p>
        <Button importance="secondary" onClick={logout}>Log ud</Button>
      </>)}
    </div>
  );
}