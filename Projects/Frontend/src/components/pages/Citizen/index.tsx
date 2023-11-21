import { CitizenProvider } from "providers/CitizenProvider";
import PageLayout from "../_Page";
import Citizen from "./Citizen";
import './Citizen.scss';
import NotificationProvider from "providers/NotificationProvider";

export default function CitizenPage() {
  return (
    <PageLayout title="Borderside" description="Se dine bestillinger og dit notat">
      <NotificationProvider>
        <CitizenProvider>
          <Citizen />
        </CitizenProvider>
      </NotificationProvider>
    </PageLayout>
  );
}