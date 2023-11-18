import { useAsyncEffect } from "danholibraryrjs";
import { useAuth } from "providers/AuthProvider";
import { useCitizen, RequestCitizen } from "providers/CitizenProvider";

import { BookingDashboard, CitizenNote } from "./components";

export default function Citizen() {
  const { user } = useAuth();
  const { setCitizen } = useCitizen(true);

  useAsyncEffect(async () => {
    if (!user?.id) return;
    const citizen = await RequestCitizen(user?.id);
    if (citizen) setCitizen(citizen);
  }, [user?.id]);

  return (
    <div className="citizens-page">
      <BookingDashboard />
      <CitizenNote />
    </div>
  );
}