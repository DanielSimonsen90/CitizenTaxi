import { DOMAIN_NAME } from "SiteConstants";
import LoggedInContainer from "./components/LoggedInContainer";

export default function Header() {
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