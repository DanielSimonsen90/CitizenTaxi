import { CitizenProviderContextType } from "providers/CitizenProvider/CitizenProviderTypes";
import { Guid } from "types";
import { ActionNames, ActionReturnTypes, Actions, ApiEndpoints, Request, showNotification } from "utils";

type Props = {
  setCitizen?: CitizenProviderContextType['setCitizen'];
  setNote?: CitizenProviderContextType['setNote'];
  setBookings?: CitizenProviderContextType['setBookings'];
  closeModalAutomatically?: boolean;
};

export default function useApiActions({
  setBookings, setCitizen, setNote,
  closeModalAutomatically: shouldCloseModal = true
}: Props = {}) {
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
          if (!shouldCloseModal) closeModal();
          
          if (setter) {
            if (action.includes('create')) setter === setBookings ? setter(bookings => [...bookings, {
              ...response.data,
              arrival: new Date(response.data.arrival),
            }]) : setter(response.data);
            // Update returns 204, no content, so we have to use the payload instead of the response data for updates
            else setter === setBookings ? setter(bookings => [...bookings, updatePayload as any]) : setter(updatePayload as any);
          }
          else console.warn(`No setter was provided for ${action}, so the response data was not set.`);
        }

        showNotification({
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
          if (!shouldCloseModal) closeModal();
          if (setter) setter === setBookings ? setter(bookings => bookings.filter(b => b.id !== entityId)) : setter(() => null as any);
          else console.warn(`No setter was provided for ${action}, so the response data was not set.`);
        }

        showNotification({
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
            : baseEndpoint === 'users' && !entityId ? baseEndpoint
            : `${baseEndpoint}/${entityId}`
        );
        const response = await Request<any, Guid>(endpoint, options);

        if (!response.success) showNotification({
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