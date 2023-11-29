import { DetailedHTMLProps, InputHTMLAttributes } from "react";
import { FunctionComponent } from "danholibraryrjs";
import { StepProps } from "./Steps/StepTypes";

import NotFound from "../NotFound";
import {
  BookTaxi__Step1,
  BookTaxi__Step2,
  BookTaxi__Step3
} from "./Steps";
import { BookingStepsPayload } from "./BookTaxiTypes";

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

export function getStepData(step: number) {
  switch (step) {
    case 1: return new BookingStep(
      "Hvor skal du hen?",
      "Vælg din destination",
      BookTaxi__Step1,
      false);

    case 2: return new BookingStep(
      "Hvornår skal du være der?",
      "Vælg dato og tidspunkt for ankomst til din destination",
      BookTaxi__Step2);

    case 3: return new BookingStep(
      "Hvor skal vi hente dig?",
      "Vælg din lokation for afhentning",
      BookTaxi__Step3,
      true, false);

    default: return new BookingStep(
      "Du er trådt forkert...",
      "Trinnet du leder efter findes ikke",
      NotFound
    );
  }
}

export function getValidationMessage(
  value: string, 
  onChange: (newValue: string) => void
): DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  return {
    value, 
    onChange: e => onChange(e.currentTarget.value)
  }
}

/**
 * 
 * @param payload 
 * @returns IsInvalid
 */
export function checkPayloadValidity(payload: BookingStepsPayload): boolean {
  const objectKeys = Object.keysOf(payload)
    .filter(key => key !== 'citizenId' && key !== 'id');

  for (const key of objectKeys) {
    const isFalsy = [undefined, null, ''].includes(payload[key]);
    if (isFalsy) return true;
  }

  return false;
}