import OverviewLayout from "../../components/OverviewLayout";
import { useCitizenModals } from "../AdminOverviewModalHooks";

export default function AdminCitizenOverview() {
  const { CreateCitizenModal } = useCitizenModals();

  return <OverviewLayout pageTitle="Borgerside" entity="borger" 
    mainCreateModal={CreateCitizenModal} />
}