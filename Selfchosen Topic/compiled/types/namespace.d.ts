declare namespace Calculator {
    function add(a: number, b: number): number;
    function subtract(a: number, b: number): number;
    namespace TimeCalculator {
        function hoursToMinutes(hours: number): number;
        function minutesToHours(minutes: number): number;
    }
}
