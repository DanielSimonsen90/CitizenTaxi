import { Dispatch, SetStateAction } from "react";
import { Citizen } from "models/backend/common";
import { CitizenProviderContextType } from "providers/CitizenProvider/CitizenProviderTypes";
import { Guid, Nullable } from "types";
import { ActionNames, ActionReturnTypes, Actions, ApiEndpoints, Request, showNotification } from "utils";

type Props = {
  setCitizen?: CitizenProviderContextType['setCitizen'];
  setCitizens?: Dispatch<SetStateAction<Array<Citizen>>>;
};

export default function useApiActions({
  setCitizen, setCitizens,
}: Props = {}) {
  async function dispatch<Action extends ActionNames>(
    action: Action,
    ...args: Actions[Action]
  ): Promise<ActionReturnTypes[Action]> {
    let value: ActionReturnTypes[Action] = null as any;
    const closeModal = () => {
      const dialog = document.querySelector('dialog[open]') as HTMLDialogElement | null;
      dialog?.close();
    };

    const baseEndpoint = action.includes('Citizen') ? `users`
      : action.includes('Note') ? `notes`
      : `bookings`;
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
          if (setCitizens && action.includes('Citizen')) setCitizens(citizens => {
            const updatedCitizens = !isUpdateAction
              ? [...citizens, response.data]
              : citizens.map(citizen => citizen.id === updatePayload.id ? updatePayload : citizen);
            return updatedCitizens;
          });
          if (setCitizen) setCitizen(citizen => {
            const updatedNote = action.includes('Note')
              ? (isUpdateAction ? updatePayload : response.data)
              : citizen?.note;
            const updatedBookings = action.includes('Booking')
              ? (isUpdateAction
                ? citizen?.bookings?.map(booking => booking.id === updatePayload.id ? updatePayload : booking)
                : [...citizen?.bookings ?? [], updatePayload])
              : citizen?.bookings;
            const updatedCitizen = action === 'createCitizen'
              ? response.data
              : {
                ...(action.includes('Citizen') ? updatePayload : citizen),
                note: updatedNote,
                bookings: updatedBookings,
              };

            return updatedCitizen;
          });
          else console.warn(`No setter was provided for ${action}, so the response data was not set.`);
        }

        showNotification({
          message: response.success ? `${entityName} ${isUpdateAction ? 'opdateret' : 'oprettet'}` : response.text,
          type: response.success ? 'success' : 'error',
        });

        value = response.data as ActionReturnTypes[Action];
        break;
      }

      case 'deleteCitizen':
      case 'deleteBooking':
      case 'deleteNote': {
        const [entityId] = args as Actions['deleteCitizen' | 'deleteBooking' | 'deleteNote'];
        const response = await Request(`${baseEndpoint}/${entityId}`, { method: 'DELETE' });

        if (response.success) {
          if (setCitizen) setCitizen(citizen => {
            let updatedCitizen: Nullable<Citizen> = { ...citizen } as Citizen;

            if (action.includes('Booking')) updatedCitizen.bookings = updatedCitizen.bookings?.filter(booking => booking.id !== entityId);
            else if (action.includes('Note')) updatedCitizen.note = null;
            else if (action.includes('Citizen')) updatedCitizen = null;

            return updatedCitizen;
          });
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


        value = (() => {
          // Return the updated value
          if (!action.includes('Booking') && !action.includes('Citizen')) return response.data as ActionReturnTypes[Action];
  
          switch (action) {
            case 'getBookings': return (response.data as ActionReturnTypes['getBookings']).map(booking => ({
              ...booking,
              arrival: new Date(booking.arrival),
            })) as ActionReturnTypes['getBookings'] as ActionReturnTypes[Action];
            case 'getBooking': return {
              ...response.data,
              arrival: new Date(response.data.arrival),
            } as ActionReturnTypes['getBooking'] as ActionReturnTypes[Action];
  
            case 'getCitizens': return (response.data as ActionReturnTypes['getCitizens']).map(citizen => ({
              ...citizen,
              bookings: (citizen.bookings as Array<Citizen['bookings'][0]>).map(booking => ({
                ...booking,
                arrival: new Date(booking.arrival),
              })),
            })) as ActionReturnTypes['getCitizens'] as ActionReturnTypes[Action];
            case 'getCitizen': return {
              ...response.data,
              bookings: (response.data.bookings as Array<Citizen['bookings'][0]>).map(booking => ({
                ...booking,
                arrival: new Date(booking.arrival),
              })),
            } as ActionReturnTypes['getCitizen'] as ActionReturnTypes[Action];
            default: throw new Error(`Action ${action} is not supported`);
          }
        })();

        return value as any;
      }
    }

    closeModal();
    return value;
  };

  return dispatch;
};