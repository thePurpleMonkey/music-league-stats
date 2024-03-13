export class OrdinalSuffixFormatValueConverter {
    toView(value) {
        // Check if the number is between 4 and 20, or ends in 11, 12, or 13.
        // If it is, return the number with the suffix "th".
        if ((value >= 4 && value <= 20) || (value % 100 >= 11 && value % 100 <= 13)) {
            return "th";
        }

        // Otherwise, return the number with the appropriate suffix based on the last digit.
        switch (value % 10) {
            case 1:
            return "st";
            case 2:
            return "nd";
            case 3:
            return "rd";
            default:
            return "th";
        }
    }
}