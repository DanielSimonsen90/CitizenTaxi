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
  const {
    bookingId,
    ...params
  } = useParams();
  const navigate = useNavigate();
  const { citizen } = useCitizen(true);
  const step = params.step ? Number(params.step) : 1;

  const [submitted, setSubmitted] = useState(false);
  const [payload, setPayload] = useStateInQuery<BookingStepsPayload>('booking', {
    id: bookingId,
    citizenId: citizen?.id,
  });
  const { title, description, canContinue, canGoBack } = getStepData(step);
  const updatePayload = (data: Partial<BookingStepsPayload>) => setPayload(prev => ({ ...prev, ...data }));
  const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = serializeForm<BookingStepsPayload>(e.target as HTMLFormElement);
    updatePayload(data);
    setSubmitted(true);
  };

  const navigateToStep = (step: number) => navigate(
    `${step}?booking=${JSON.stringify(payload)}`
  );

  useUpdateEffect(() => {
    if (!submitted) return;
    if (canContinue) {
      setSubmitted(false);
      return navigateToStep(step + 1);
    } 
    if (!payload.citizenId) return updatePayload({ citizenId: citizen?.id });

    (async function sendBooking() {
      console.log('Sending booking', payload);
      await RequestBookings(payload.citizenId, {
        method: 'id' in payload && payload.id ? 'PUT' : 'POST',
        body: {
          ...payload,
          arrival: new Date(`${payload.date}T${payload.time}Z`).toISOString()
        }
      });
      navigate('/');
    })();
  }, [submitted, payload, canContinue, navigate]);

  useUpdateEffect(() => {
  }, [citizen?.id]);

  return (
    <div className="book-taxi">
      <header>
        <nav>
          <Link to="/">← Annullér bestillingsprocessen</Link>
        </nav>
      </header>

      <main>
        <article data-step={step}>
          <h1>{title}</h1>
          <p className="secondary">{description}</p>

          <form onSubmit={onFormSubmit}>
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