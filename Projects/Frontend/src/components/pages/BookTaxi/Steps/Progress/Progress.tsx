import { MAX_STEPS } from "../../BookTaxiConstants";

type Props = {
  step: string;
};

export default function Progress({ step }: Props) {
  const steps = Array.from({ length: MAX_STEPS }, (_, i) => i + 1);

  return (
    <nav>
      {steps.map(s => (
        <span>{s}</span>
      ))}
    </nav>
  );
}