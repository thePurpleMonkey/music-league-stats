import numeral from 'numeral';

export class PercentageFormatValueConverter {
    toView(value) {
        return numeral(value).format('0.00%');
    }
}