import { useState } from "react";
import { Citizen } from "models/backend/common";
import { useNoteModals } from "../../components/EntityModifyModal/AdminOverviewModalHooks";
import OverviewLayout from "../../components/OverviewLayout";

export default function AdminNotesOverview() {
  const [citizens, setCitizens] = useState<Array<Citizen>>([]);
  const { CreateNoteModal } = useNoteModals(citizens);

  return <OverviewLayout pageTitle="Notatside" entity="notat"
    citizens={citizens} setCitizens={setCitizens}
    mainCreateModal={CreateNoteModal}
    hideCitizens hideBookings
  />;
}