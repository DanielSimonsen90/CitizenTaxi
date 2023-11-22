import { CitizenProvider } from "providers/CitizenProvider";
import PageLayout from "../_Page";
import Citizen from "./Citizen";
import './Citizen.scss';

export default function CitizenPage() {
  return (
    <PageLayout title="Borderside" description="Se dine bestillinger og dit notat">
      <CitizenProvider>
        <Citizen />
      </CitizenProvider>
    </PageLayout>
  );
}