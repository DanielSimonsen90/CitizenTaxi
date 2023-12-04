var Calculator;
(function (Calculator) {
    function add(a, b) {
        return a + b;
    }
    Calculator.add = add;
    function subtract(a, b) {
        return a - b;
    }
    Calculator.subtract = subtract;
    let TimeCalculator;
    (function (TimeCalculator) {
        function hoursToMinutes(hours) {
            return hours * 60;
        }
        TimeCalculator.hoursToMinutes = hoursToMinutes;
        function minutesToHours(minutes) {
            return minutes / 60;
        }
        TimeCalculator.minutesToHours = minutesToHours;
    })(TimeCalculator = Calculator.TimeCalculator || (Calculator.TimeCalculator = {}));
})(Calculator || (Calculator = {}));
Calculator.add(1, 2);
Calculator.TimeCalculator.hoursToMinutes(2);
//# sourceMappingURL=namespace.js.map