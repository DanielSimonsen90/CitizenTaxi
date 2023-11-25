import OverviewLayout from "../../components/OverviewLayout";
import { useCitizenModals } from "../../components/EntityModifyModal/AdminOverviewModalHooks";
import { Citizen } from "models/backend/common";
import { useState } from "react";

export default function AdminCitizenOverview() {
  const [citizens, setCitizens] = useState<Array<Citizen>>([]);
  const { CreateCitizenModal } = useCitizenModals({ setCitizens });

  return <OverviewLayout pageTitle="Borgerside" entity="borger" 
    citizens={citizens} setCitizens={setCitizens}
    mainCreateModal={CreateCitizenModal} />
}