namespace Calculator {
  export function add(a: number, b: number) {
    return a + b;
  }

  export function subtract(a: number, b: number) {
    return a - b;
  }
  
  export namespace TimeCalculator {
    export function hoursToMinutes(hours: number) {
      return hours * 60;
    }
  
    export function minutesToHours(minutes: number) {
      return minutes / 60;
    }
  }
}


Calculator.add(1, 2);
Calculator.TimeCalculator.hoursToMinutes(2);