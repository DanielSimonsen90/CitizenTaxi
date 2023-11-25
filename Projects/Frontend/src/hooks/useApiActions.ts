import { Citizen } from "models/backend/common";
import { CitizenProviderContextType } from "providers/CitizenProvider/CitizenProviderTypes";
import { Dispatch, SetStateAction } from "react";
import { Guid, Nullable } from "types";
import { ActionNames, ActionReturnTypes, Actions, ApiEndpoints, Request, showNotification } from "utils";

type Props = {
  setCitizen?: CitizenProviderContextType['setCitizen'];
  setCitizens?: Dispatch<SetStateAction<Array<Citizen>>>;
  closeModalAutomatically?: boolean;
};

export default function useApiActions({
  setCitizen, setCitizens,
  closeModalAutomatically: shouldCloseModal = true
}: Props = {}) {
  async function dispatch<Action extends ActionNames>(
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
          if (setCitizens && action.includes('Citizen')) setCitizens(citizens => [...citizens ?? [], response.data]);
          if (setCitizen) setCitizen(citizen => {
            const updatedNote = action.includes('Note') ? response.data : citizen?.note;
            const updatedBookings = action.includes('Booking') ? [...citizen?.bookings ?? [], updatePayload] : citizen?.bookings;
            const updatedCitizen = action.includes('Citizen') ? response.data : {
              ...citizen,
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

    if (shouldCloseModal) closeModal();
    return closeModal as ActionReturnTypes[Action];
  };

  return dispatch;
};