import { Button } from "danholibraryrjs";
import { Booking } from "models/backend/common";
import { BookingModifyPayload } from "models/backend/business/models/payloads";
import FormGroup from "components/shared/FormGroup";
import EntityModifyModal, { BOOKING_ENTITY_NAME, EntityModifyExtendProps } from "../../EntityModifyModal";

type BookingFormBody = Pick<BookingModifyPayload<any>, 'destination' | 'pickup'> & {
  arrivalDate: string;
  arrivalTime: string;
}

export default function BookingModal({ 
  modalRef, crud,
  defaultModel, selectedCitizen, 
  citizens,
  ...props
}: EntityModifyExtendProps<Booking, BookingModifyPayload<any>>) {
  const [defaultDate, defaultTimeString] = defaultModel?.arrival.toISOString().split(/[T.]/) 
    ?? new Date().toISOString().split('T');

  function convertTime(defaultTimeString: string) {
    return defaultTimeString ?? new Date().toISOString();
  }

  async function onSubmit(model: BookingModifyPayload<any>) {
    // Convert the date and time to a Date object for model.arrival
    const correctModel = model as any as BookingFormBody;
    const arrivalDateTimeString = `${correctModel.arrivalDate}T${convertTime(correctModel.arrivalTime)}:00.000Z`;
    model.arrival = new Date(arrivalDateTimeString);
    return props.onSubmit(model);
  }

  return (
    <EntityModifyModal modalRef={modalRef} entityName={BOOKING_ENTITY_NAME}
      crud={crud} onSubmit={onSubmit} citizens={citizens}
      defaultModel={defaultModel} selectedCitizen={selectedCitizen}
      payload={{} as BookingModifyPayload<any>}
    >
      <FormGroup label="Til" htmlFor={`${crud}-booking-destination`}>
        <input type="text" id={`${crud}-booking-destination`} name="destination" defaultValue={defaultModel?.destination} />
      </FormGroup>

      <FormGroup label="Ankomstdato" htmlFor={`${crud}-booking-arrival-date`}>
        <input type="date" id={`${crud}-booking-arrival-date`} name="arrivalDate" defaultValue={defaultDate} />
      </FormGroup>

      <FormGroup label="Ankomsttid" htmlFor={`${crud}-booking-arrival-time`}>
        <input type="time" id={`${crud}-booking-arrival-time`} name="arrivalTime" defaultValue={convertTime(defaultTimeString)} />
      </FormGroup>

      <FormGroup label="Fra" htmlFor={`${crud}-booking-pickup`}>
        <input type="text" id={`${crud}-booking-pickup`} name="pickup" defaultValue={defaultModel?.pickup} />
      </FormGroup>

      <div className="button-container">
        <Button type="button" importance="secondary" className="alt" onClick={() => modalRef.current?.close()}>Fortryd</Button>
        <Button type="submit" crud={crud}>{crud === 'create' ? 'Opret' : 'Opdater'} bestilling</Button>
      </div>
    </EntityModifyModal>
  );
}