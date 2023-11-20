import Events from "..";
import { EventProps, HubEventNames } from "./HubEventTypes";

export default async function EventReducer<Event extends HubEventNames>(
  event: Event,
  props: EventProps<Event>
): Promise<void> {
  if (!Events[event]) throw new Error(`Event ${event} not found`);

  const { callback } = Events[event];

  try {
    return await callback(props);
  } catch (error) {
    console.error(error);
    throw error;
  }
}