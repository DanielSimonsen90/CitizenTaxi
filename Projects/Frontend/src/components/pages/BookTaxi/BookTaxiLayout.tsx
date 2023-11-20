import { Link, Outlet, useNavigate, useParams } from "react-router-dom";
import { Button, classNames, useStack, useUpdateEffect } from "danholibraryrjs";

import { serializeForm } from "utils";
import { useStateInQuery } from "hooks";

import { getStepData } from "./BookTaxiConstants";
import { BookingStepsPayload } from "./BookTaxiTypes";
import Progress from "./Steps/Progress";
import { useCitizen } from "providers/CitizenProvider";
import { useState } from "react";

export default function BookTaxi() {
  const {
    bookingId,
    ...params
  } = useParams();
  const navigate = useNavigate();
  const { citizen } = useCitizen(true);
  const step = params.step ? Number(params.step) : 1;

  const [payload, setPayload] = useStateInQuery<BookingStepsPayload>('booking', {
    id: bookingId,
    citizenId: citizen?.id,
  });
  const { title, description, canContinue, canGoBack } = getStepData(step);
  const [submitted, setSubmitted] = useState(false);
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
    if (canContinue && submitted) {
      setSubmitted(false);
      return navigateToStep(step + 1);
    }
    if (!canContinue) console.log('Submit payload', payload);
  }, [submitted, payload, canContinue, navigate]);

  useUpdateEffect(() => {
    updatePayload({ citizenId: citizen?.id });
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