import { CitizenProviderContextType } from "providers/CitizenProvider/CitizenProviderTypes";
import { useNotification } from "providers/NotificationProvider";
import { Guid } from "types";
import { ActionNames, ActionReturnTypes, Actions, ApiEndpoints, Request } from "utils";

type Props = {
  setCitizen?: CitizenProviderContextType['setCitizen'];
  setNote?: CitizenProviderContextType['setNote'];
  setBookings?: CitizenProviderContextType['setBookings'];
  allBookings?: CitizenProviderContextType['allBookings'];
};

export const useApiActions = ({
  allBookings, setBookings, setCitizen, setNote
}: Props) => {
  const { setNotification } = useNotification();

  return async function dispatch<Action extends ActionNames>(
    action: Action,
    ...args: Actions[Action]
  ): Promise<ActionReturnTypes[Action]> {
    const closeModal = () => {
      const dialog = document.querySelector('dialog[open]') as HTMLDialogElement | null;
      dialog?.close();
    };

    const baseEndpoint = action.includes('Citizen') ? `users`
      : action.includes('Note') ? `notes`
      : `bookings`;
    const setter = action.includes('Citizen') ? setCitizen
      : action.includes('Note') ? setNote
      : setBookings;
    const entityName = action.includes('Citizen') ? 'Borger'
      : action.includes('Note') ? 'Notat'
      : 'Bestilling';

    switch (action) {
      case 'createCitizen':
      case 'createNote':
      case 'createBooking':
      case 'updateCitizen':
      case 'updateBooking':
      case 'updateNote': {
        // These are the same object, but typescript interprets them as different types due to update having an id and create not having one
        const [createPayload] = args as Actions['createCitizen' | 'createNote' | 'createBooking'];
        const [updatePayload] = args as Actions['updateCitizen' | 'updateBooking' | 'updateNote'];

        const isUpdateAction = action.includes('update');
        const response = await Request<any, Guid>(isUpdateAction ? `${baseEndpoint}/${updatePayload.id}` : baseEndpoint, {
          method: isUpdateAction ? 'PUT' : 'POST',
          body: createPayload // Doesn't matter whether createPayload or updatePayload is used, as they are the same object
        });

        if (response.success) {
          closeModal();

          if (setter) setter(response.data);
          else console.warn(`No setter was provided for ${action}, so the response data was not set.`);
        }

        setNotification({
          message: response.success ? `${entityName} ${isUpdateAction ? 'opdateret' : 'oprettet'}` : response.text,
          type: response.success ? 'success' : 'error',
        });

        break;
      }

      case 'deleteCitizen':
      case 'deleteBooking':
      case 'deleteNote': {
        const [entityId] = args as Actions['deleteCitizen' | 'deleteBooking' | 'deleteNote'];
        const response = await Request(`${baseEndpoint}/${entityId}`, { method: 'DELETE' });

        if (response.success) {
          if (setter) {
            // @ts-ignore -- If the entity is a booking, remove it from the allBookings array as allBookings should always be an array.
            action === 'deleteBooking' ? setter(allBookings.filter(b => b.id !== entityId)) : setter(null);
          } else console.warn(`No setter was provided for ${action}, so the response data was not set.`);
        }

        setNotification({
          message: response.success ? `${entityName} slettet` : response.text,
          type: response.success ? 'success' : 'error',
        });

        break;
      }

      case 'getCitizens':
      case 'getBookings':
      case 'getNotes':
      case 'getCitizen':
      case 'getBooking':
      case 'getNote': {
        const [entityId, options] = args as Actions[
          'getCitizens' | 'getBookings' | 'getNotes' |
          'getCitizen' | 'getBooking' | 'getNote'
        ];

        const endpoint: ApiEndpoints<Guid> = (
          (action.endsWith('s') || action === 'getNote')
            && entityId && baseEndpoint !== 'users'
            ? `${baseEndpoint}?citizenId=${entityId}`
            : baseEndpoint === 'users' ? `${baseEndpoint}/${entityId}`
              : `${baseEndpoint}/${entityId}`
        );
        const response = await Request<any, Guid>(endpoint, options);

        if (!response.success) setNotification({
          message: response.text,
          type: 'error',
        });

        if (!action.includes('Booking')) return response.data as ActionReturnTypes[Action];
        if (action === 'getBookings') return (response.data as ActionReturnTypes['getBookings']).map(booking => ({
          ...booking,
          arrival: new Date(booking.arrival),
        })) as ActionReturnTypes['getBookings'] as ActionReturnTypes[Action];
        if (action === 'getBooking') return {
          ...response.data,
          arrival: new Date(response.data.arrival),
        } as ActionReturnTypes['getBooking'] as ActionReturnTypes[Action];
      }
    }

    return closeModal as ActionReturnTypes[Action];
  };
};