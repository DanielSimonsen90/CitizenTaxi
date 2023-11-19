import { useEffect } from "react";
import { Link, Outlet, useNavigate, useParams } from "react-router-dom";
import { Button, classNames } from "danholibraryrjs";

import { serializeForm } from "utils";
import { useStateInQuery } from "hooks";

import { MAX_STEPS } from "./BookTaxiConstants";
import { getStepData } from "./BookTaxiConstants";
import { BookingStepsPayload } from "./BookTaxiTypes";
import Progress from "./Steps/Progress";

export default function BookTaxi() {
  const {
    step = "1",
    bookingId
  } = useParams();
  const navigate = useNavigate();

  const [payload, setPayload] = useStateInQuery<BookingStepsPayload>('booking', { id: bookingId });
  const { title, description, canContinue, canGoBack } = getStepData(step);
  const redirectToNextStep = (data: BookingStepsPayload) => {
    setPayload(prev => ({ ...prev, ...data }));
    if (canContinue) navigate(`${Number(step) + 1}?booking=${JSON.stringify(payload)}`);
  };

  useEffect(() => {
    if (Object.keysOf(payload).some(key => payload[key] !== undefined)
      && step === MAX_STEPS.toString()) {
      console.log('Submit payload', payload);
    }
  }, [step, payload]);

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

          <form onSubmit={e => {
            e.preventDefault();
            const data = serializeForm<BookingStepsPayload>(e.target as HTMLFormElement);
            redirectToNextStep(data);
          }}>
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