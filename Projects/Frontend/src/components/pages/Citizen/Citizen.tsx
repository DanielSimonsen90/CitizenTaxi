import { useAsyncEffect, useAsyncEffectOnce } from "danholibraryrjs";
import { useAuth } from "providers/AuthProvider";
import { useCitizen } from "providers/CitizenProvider";
import { RequestCitizen } from "providers/CitizenProvider/CitizenProviderConstants";

export default function Citizen() {
  const { user } = useAuth();
  const { bookings, note, setCitizen } = useCitizen();

  useAsyncEffect(async () => {
    if (!user?.id) return;
    const citizen = await RequestCitizen(user?.id);
    if (citizen) setCitizen(citizen);
  }, [user?.id]);

  return (
    <div>
      <p>Citizen with {bookings?.length} bookings & {note ? '1' : 'no'} note</p>
    </div>
  );
}