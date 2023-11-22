import { Citizen, Role } from "models/backend/common";
import { useState } from "react";
import OverviewLayout from "../../components/OverviewLayout";
import { useAsyncEffectOnce } from "danholibraryrjs";
import { Request } from "utils";
import { useNotification } from "providers/NotificationProvider";

export default function AdminCitizenOverview() {
  const [citizens, setCitizens] = useState<Array<Citizen>>([]);
  const { setNotification } = useNotification();

  useAsyncEffectOnce(async () => {
    const response = await Request<Array<Citizen>, string>(`users?role=${Role.Citizen}`);
    if (response.data) setCitizens(response.data);
    else setNotification({ type: "error", message: response.text });
  });

  return <OverviewLayout pageTitle="Borgerside" entity="borger" citizens={citizens} />;
}