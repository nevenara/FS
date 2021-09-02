import moment = require("moment");

export class DoorsOpenTimeFormat {
    public static format(doorsOpen: Date) {
        if (!doorsOpen) {
            return '';
        }

        return moment(doorsOpen).tz('Europe/Vienna').format('HH:mm'); //19:30
    }
}