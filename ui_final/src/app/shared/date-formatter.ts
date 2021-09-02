import * as moment from 'moment-timezone';

export class DateFormatter {
    public getDate(date) {
        return moment(date).tz("Europe/Vienna").format('DD.MM.YYYY');
    }

    public getHours(date) {
        return moment(date).tz("Europe/Vienna").format('HH:mm');
    }
}