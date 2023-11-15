import { DOMAIN_NAME } from "SiteConstants";
import PageLayout from "../_Page";
import Login from "./Login";
import './Login.scss';

export default function LoginPage() {
  return (
    <PageLayout title="Login" description={`Log ind for at benytte ${DOMAIN_NAME}`}>
      <Login />
    </PageLayout>
  );
}