import NotFound from "../NotFound";
import { BookingStep } from "./BookTaxiConstants";
import {
  BookTaxi__Step1,
  BookTaxi__Step2,
  BookTaxi__Step3
} from "./Steps";

export function usePageSteps(step: string) {
  switch (step) {
    case "1": return new BookingStep(
      "Hvor skal du hen?", 
      "Vælg din destination", 
      BookTaxi__Step1,
      false);

    case "2": return new BookingStep(
      "Hvornår skal du være der?", 
      "Vælg dato og tidspunkt for ankomst til din destination", 
      BookTaxi__Step2);
      
    case "3": return new BookingStep(
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