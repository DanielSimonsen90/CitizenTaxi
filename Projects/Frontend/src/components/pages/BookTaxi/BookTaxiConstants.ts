import { DetailedHTMLProps, FormEvent, InputHTMLAttributes } from "react";
import { FunctionComponent } from "danholibraryrjs";
import { StepProps } from "./Steps/StepTypes";

import NotFound from "../NotFound";
import {
  BookTaxi__Step1,
  BookTaxi__Step2,
  BookTaxi__Step3
} from "./Steps";

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
  property: string, 
  value: string, 
  onChange: (newValue: string) => void
): DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  return {
    required: true, 
    onInvalid: (e: FormEvent) => (e.target as HTMLInputElement).setCustomValidity(
      `Du skal indtaste ${property}, før du kan fortsætte`
    ),
    value, 
    onChange: e => onChange(e.currentTarget.value)
  }
}