import { useState } from "react";
import { useAsyncEffectOnce } from "danholibraryrjs";

import { Request } from "utils";
import { Citizen, Role } from "models/backend/common";
import { useNotification } from "providers/NotificationProvider";

import OverviewLayout from "../../components/OverviewLayout";
import { CitizenModal } from "../../components/EntityModifyModal";
import { useBookingModals, useCitizenModals, useNoteModals } from "../AdminOverviewHooks";
import { 
  onViewAllBookings, 
  onCreateCitizenSubmit, onEditCitizenSubmit, onDeleteCitizenSubmit 
} from './AdminCitizenOverviewConstants';

export default function AdminCitizenOverview() {
  const [citizens, setCitizens] = useState<Array<Citizen>>([]);
  const { setNotification } = useNotification();

  const citizenModalProps = useCitizenModals({ 
    onEditSubmit: (payload) => onEditCitizenSubmit(payload, setNotification),
    onCreateSubmit: (payload) => onCreateCitizenSubmit(payload, setNotification)
  });
  const bookingModalProps = useBookingModals({
    onCreateSubmit: (payload) => { throw new Error("Not implemented") },
    onEditSubmit: (payload) => { throw new Error("Not implemented") }
  });
  const noteModalProps = useNoteModals({
    onCreateSubmit: (payload) => { throw new Error("Not implemented") },
    onEditSubmit: (payload) => { throw new Error("Not implemented") }
  });

  useAsyncEffectOnce(async () => {
    const response = await Request<Array<Citizen>, string>(`users?role=${Role.Citizen}`);
    if (response.data) setCitizens(response.data);
    else setNotification({ type: "error", message: response.text });
  });

  return (
    <OverviewLayout pageTitle="Borgerside" entity="borger" citizens={citizens}
      {...citizenModalProps}
      {...bookingModalProps}
      {...noteModalProps}
      onViewAllBookings={onViewAllBookings}
    />
  );
}