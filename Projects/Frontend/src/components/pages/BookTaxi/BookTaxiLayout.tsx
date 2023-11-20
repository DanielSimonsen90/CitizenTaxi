import { useState } from "react";
import { Link, Outlet, useNavigate, useParams } from "react-router-dom";
import { Button, classNames, useUpdateEffect } from "danholibraryrjs";

import { serializeForm } from "utils";
import { useStateInQuery } from "hooks";
import { RequestBookings, useCitizen } from "providers/CitizenProvider";

import { getStepData } from "./BookTaxiConstants";
import { BookingStepsPayload } from "./BookTaxiTypes";
import Progress from "./Steps/Progress";

export default function BookTaxi() {
  // Destructure the bookingId from the URL
  const {
    bookingId,
    ...params
  } = useParams();

  // Navigator function from react-router-dom to navigate to a different page
  const navigate = useNavigate();

  // Get the citizen from the CitizenProvider to use it for assigning the booking to the citizen
  const { citizen } = useCitizen(true);

  // Get the step from the URL, or default to 1 if it's not a number
  const step = params.step ? Number(params.step) : 1;

  // State to keep track of whether or not the form has been submitted
  // This is to prevent component updates that accidentally switch to the next step
  const [submitted, setSubmitted] = useState(false);

  // State to keep track of the booking payload. 
  // This is kept in the URL query string to allow the user to refresh the page 
  // without losing their progress
  const [payload, setPayload] = useStateInQuery<BookingStepsPayload>('booking', {
    id: bookingId,
    citizenId: citizen?.id,
  });

  // Get the data for the current step
  const { title, description, canContinue, canGoBack } = getStepData(step);

  // Function to update the payload state
  const updatePayload = (data: Partial<BookingStepsPayload>) => setPayload(prev => ({ ...prev, ...data }));

  // When the step is submitted, serialize the form data and update the payload state
  // This will automatically trigger the useEffect hook below to navigate to the next step
  const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = serializeForm<BookingStepsPayload>(e.target as HTMLFormElement);
    updatePayload(data);
    setSubmitted(true);
  };

  // Function to navigate to the next step while keeping the booking payload in the URL
  const navigateToStep = (step: number) => navigate(
    `${step}?booking=${JSON.stringify(payload)}&bookingId=${bookingId}`
  );

  // When any of the dependencies update, run the callback
  useUpdateEffect(() => {
    // If the form hasn't been submitted, don't do anything as this was triggered by internal state changes
    if (!submitted) return;

    // If the user has more steps to complete, navigate to the next step
    if (canContinue) {
      setSubmitted(false);
      return navigateToStep(step + 1);
    } 

    // If the user has completed all steps, make sure the citizenId is set
    if (!payload.citizenId) return updatePayload({ citizenId: citizen?.id });

    // Once the steps are completed and the citizenId is set, send the booking to the API
    (async function sendBooking() {
      await RequestBookings(payload.citizenId, {
        // If the payload has an id, use PUT, otherwise use POST
        method: 'id' in payload && payload.id ? 'PUT' : 'POST',
        body: {
          ...payload,
          // Combine the date and time into a single ISO string
          arrival: new Date(`${payload.date}T${payload.time}Z`).toISOString()
        }
      });

      // Navigate to the citizen page once the booking has been sent
      navigate('/');
    })();
  }, [submitted, payload, canContinue, navigate]);

  return (
    <div className="book-taxi">
      <header>
        <nav>
          {/*
            Using the react-router's Link component ultimately renders an <a> tag, 
            but it will use the react-router's history API to navigate to the page 
            instead of reloading the page unnecessarily 
          */}
          <Link to="/">← Annullér bestillingsprocessen</Link>
        </nav>
      </header>

      <main>
        <article data-step={step}>
          <h1>{title}</h1>
          <p className="secondary">{description}</p>

          <form onSubmit={onFormSubmit}>
            {/* The Outlet component is from react-router, that will render sub-routes into this layout page */}
            <Outlet />

            <footer className="button-container">
              <Button type="button" className={classNames('button secondary', canGoBack ? undefined : 'disabled')}
                onClick={e => !canGoBack 
                  ? e.preventDefault() 
                  : navigateToStep(step - 1)}
              >Tilbage</Button>
              <Progress step={step} />
              <Button type="submit">{canContinue ? 'Videre' : 'Afslut'}</Button>
            </footer>
          </form>
        </article>

      </main>
    </div>
  );
}