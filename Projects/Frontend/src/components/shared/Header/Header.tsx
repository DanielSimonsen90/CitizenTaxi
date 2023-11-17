import { DOMAIN_NAME } from "SiteConstants";
import { Button } from "danholibraryrjs";
import { useAuth } from "providers/AuthProvider";
import { translateEnum } from "utils";
import LoggedInContainer from "./components/LoggedInContainer";

export default function Header() {
  const { user, logout, loggingIn } = useAuth();

  return (
    <header className="site-header">
      <div className="brand">
        <h1>{DOMAIN_NAME}</h1>
        <p>Svendeprøve-projekt</p>
      </div>

      <LoggedInContainer />
    </header>
  );
}