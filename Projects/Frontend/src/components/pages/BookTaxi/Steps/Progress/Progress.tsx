import { Button } from "danholibraryrjs";
import { MAX_STEPS } from "../../BookTaxiConstants";
import { useNavigate } from "react-router-dom";

type Props = {
  step: number;
};

export default function Progress({ step }: Props) {
  const navigate = useNavigate();
  const steps = Array.from({ length: MAX_STEPS }, (_, i) => i + 1);

  const done = (s: number) => s < step;
  const active = (s: number) => s === step;

  return (
    <nav className="progress-container">
      {steps.map(s => (
        <Button type="button" onClick={() => done(s) ? navigate(s.toString()) : undefined} 
          className={`progress-step ${s}`} key={s}
          data-state={
            done(s) ? "done" 
            : active(s) ? "active" 
            : "todo"
          }
        ></Button>
      ))}
    </nav>
  );
}