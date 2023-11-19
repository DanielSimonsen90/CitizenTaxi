import { Link } from "react-router-dom";
import { ReactNode } from "react";
import { getBackRoute } from "./BookTaxiConstants";
import { Button, classNames } from "danholibraryrjs";
import { serializeForm } from "utils";
import Progress from "./Steps/Progress";

type Props = {
  title: string;
  description: string;
  children: ReactNode;
  
  step: string;
  redirectToNextStep: (data: any) => void;
  canGoBack: boolean;
  canContinue: boolean;
}

export default function BookTaxi({ 
  title, description, 
  children, 
  step, redirectToNextStep, 
  canGoBack, canContinue
}: Props) {
  return (
    <main className="book-taxi">
      <header>
        <nav>
          <Link to={getBackRoute(Number(step))}>
            ← Annullér bestillingsprocessen
          </Link>
        </nav>
      </header>

      <article data-step={step}>
        <h1>{title}</h1>
        <p>{description}</p>
        
        <form onSubmit={e => {
          e.preventDefault();
          const data = serializeForm(e.target as HTMLFormElement);
          redirectToNextStep(data);
        }}>
          {children}

          <footer className="button-container">
            <Link to="../" className={classNames('button secondary', canGoBack ? undefined : 'disabled')}>Tilbage</Link>
            <Progress step={step} />
            <Button type="submit">{canContinue ? 'Videre' : 'Afslut'}</Button>
          </footer>
        </form>
      </article>
    </main>
  );
}