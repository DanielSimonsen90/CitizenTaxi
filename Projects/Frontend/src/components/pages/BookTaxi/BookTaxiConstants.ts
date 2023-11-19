import { FunctionComponent } from "danholibraryrjs";
import { StepProps } from "./Steps/StepTypes";

export const MAX_STEPS = 3;

export class BookingStep {
  constructor(
    public title: string, 
    public description: string, 
    public component: FunctionComponent<StepProps>,
    public canGoBack = true,
    public canContinue = true
  ) {}
}

export const getBackRoute = (step: number) => Array.from<any>({ length: step }).reduce(acc => acc + '../', '') as string;