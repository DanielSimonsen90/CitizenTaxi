import { useState } from "react";
import { useAsyncEffectOnce } from "danholibraryrjs";

import { Request } from "utils";
import { Citizen, Role } from "models/backend/common";
import { useNotification } from "providers/NotificationProvider";

import OverviewLayout from "../../components/OverviewLayout";
import { useCitizenModals } from "../AdminOverviewModalHooks";

export default function AdminCitizenOverview() {
  const [citizens, setCitizens] = useState<Array<Citizen>>([]);
  const { setNotification } = useNotification();
  const { CreateCitizenModal } = useCitizenModals();

  useAsyncEffectOnce(async () => {
    const response = await Request<Array<Citizen>, string>(`users?role=${Role.Citizen}`);
    if (response.data) setCitizens(response.data);
    else setNotification({ type: "error", message: response.text });
  });

  return (
    <OverviewLayout pageTitle="Borgerside" entity="borger" citizens={citizens}
      mainCreateModal={CreateCitizenModal}
    />
  );
}