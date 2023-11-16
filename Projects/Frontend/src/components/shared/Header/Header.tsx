import { DOMAIN_NAME } from "SiteConstants";
import { Button } from "danholibraryrjs";
import { useAuth } from "providers/AuthProvider";
import { translateEnum } from "utils";

export default function Header() {
  const { user, logout, loggingIn } = useAuth();

  return (
    <header className="site-header">
      <div className="brand">
        <h1>{DOMAIN_NAME}</h1>
        <p>Svendeprøve-projekt</p>
      </div>

      <div className="login-container" data-logged-in={!!user}>
        {loggingIn && <p>Logger ind...</p>}
        {user && (<>
          <p>
            Du er logget ind som
            <span className="user-name">{user.name}</span>
            ,
            <span className="user-role">{translateEnum(user.role)}</span>
          </p>
          <Button onClick={logout}>Log ud</Button>
        </>)}
      </div>
    </header>
  );
}