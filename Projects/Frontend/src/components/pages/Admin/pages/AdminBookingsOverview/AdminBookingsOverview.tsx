import { useState } from "react";
import { Citizen } from "models/backend/common";
import { useBookingModals } from "../../components/EntityModifyModal/AdminOverviewModalHooks";
import OverviewLayout from "../../components/OverviewLayout";

export default function AdminBookingsOverview() {
  const [citizens, setCitizens] = useState<Array<Citizen>>([]);
  const { CreateBookingModal } = useBookingModals();

  return <OverviewLayout pageTitle="Bestillingsside" entity="bestilling"
    citizens={citizens} setCitizens={setCitizens}
    mainCreateModal={CreateBookingModal} 
    hideNotes hideCitizens
  />;
}