import { useAsyncEffect } from "danholibraryrjs";
import { useAuth } from "providers/AuthProvider";
import { useCitizen, RequestCitizen } from "providers/CitizenProvider";

import { BookingDashboard, CitizenNote } from "./components";

export default function Citizen() {
  const { user } = useAuth();
  // If the client visits this page, we know for sure that we have a user value,
  // however we just need to get the citizen from the API from the user id
  const { setCitizen } = useCitizen(true);

  useAsyncEffect(async () => {
    // If the user is not yet loaded, we don't want to do anything yet
    if (!user?.id) return;

    // Get the citizen from the API and set it in the CitizenProvider
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