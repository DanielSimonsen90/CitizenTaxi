import { useEffect } from "react";
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
    step = "1",
    bookingId
  } = useParams();
  const navigate = useNavigate();
  const { citizen } = useCitizen(true);

  const [payload, setPayload] = useStateInQuery<BookingStepsPayload>('booking', {
    id: bookingId,
    citizenId: citizen?.id,
    nextStep: 1
  });
  const { title, description, canContinue, canGoBack } = getStepData(step);
  const updatePayload = (data: BookingStepsPayload) => setPayload(prev => ({ ...prev, ...data }));
  const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = serializeForm<BookingStepsPayload>(e.target as HTMLFormElement);
    updatePayload({ ...data, nextStep: Number(step) + 1 });
  };

  useUpdateEffect(() => {
    if (canContinue && payload.nextStep > Number(step)) return navigate(
      `${Number(step) + 1}?booking=${JSON.stringify({ 
        ...payload, nextStep: false 
      })}`
    );
    if (!canContinue && payload.nextStep > Number(step)) console.log('Submit payload', payload);
  }, [payload, step, canContinue, navigate]);

  useEffect(() => {
    if (!citizen?.id) return;
    updatePayload({ citizenId: citizen?.id, nextStep: Number(step) });
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
              <Button className={classNames('button secondary', canGoBack ? undefined : 'disabled')}
                onClick={e => !canGoBack ? e.preventDefault() : navigate(-1)}
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