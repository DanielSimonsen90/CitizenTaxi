import { useAsyncEffectOnce } from "danholibraryrjs";
import { useAuth } from "providers/AuthProvider";
import { useCitizen } from "providers/CitizenProvider";
import { RequestCitizen } from "providers/CitizenProvider/CitizenProviderConstants";

export default function Citizen() {
  const { user } = useAuth();
  const { bookings, note, setCitizen } = useCitizen();

  useAsyncEffectOnce(async () => {
    const citizen = await RequestCitizen(user?.id);
    if (citizen) setCitizen(citizen);
  });

  return (
    <div>
      <p>Citizen with {bookings?.length} bookings & {note ? '1' : 'no'} note</p>
    </div>
  );
}