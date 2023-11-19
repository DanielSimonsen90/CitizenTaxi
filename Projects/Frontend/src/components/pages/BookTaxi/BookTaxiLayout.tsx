import { Link, Outlet, useNavigate, useParams } from "react-router-dom";
import { Button, classNames, useUpdateEffect } from "danholibraryrjs";

import { serializeForm } from "utils";
import { useStateInQuery } from "hooks";

import { getStepData } from "./BookTaxiConstants";
import { BookingStepsPayload } from "./BookTaxiTypes";
import Progress from "./Steps/Progress";
import { useCitizen } from "providers/CitizenProvider";

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
    nextStep: 2
  });
  const { title, description, canContinue, canGoBack } = getStepData(step);
  const updatePayload = (data: BookingStepsPayload) => setPayload(prev => ({ ...prev, ...data }));
  const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = serializeForm<BookingStepsPayload>(e.target as HTMLFormElement);
    updatePayload({ ...data, nextStep: step + 1 });
  };
  const navigateToStep = (step: number, payload: BookingStepsPayload) => navigate(
    `${step}?booking=${JSON.stringify(payload)}`
  );

  useUpdateEffect(() => {
    console.log('Step', step, 'Next', payload.nextStep);

    if (canContinue && payload.nextStep > step) return navigateToStep(payload.nextStep, {
      ...payload, nextStep: payload.nextStep + 1
    } as BookingStepsPayload);
    if (!canContinue && payload.nextStep > step) console.log('Submit payload', payload);
  }, [payload, step, canContinue, navigate]);

  useUpdateEffect(() => {
    updatePayload({ citizenId: citizen?.id, nextStep: step });
  }, [citizen?.id, step]);

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
              <Button className={classNames('button secondary', canGoBack ? undefined : 'disabled')}
                onClick={e => !canGoBack ? e.preventDefault() : navigateToStep(step - 1, { ...payload, nextStep: payload.nextStep - 2 })}
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