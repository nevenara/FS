import moment = require("moment");

export class LinkedAccountUtil {
    public static olderThanSixteen(birthDate: Date): boolean {
        const diff = moment().diff(birthDate, 'years');

        return diff > 16;
    }

    public static olderThanSixteenOrSixteen(birthDate: Date): boolean {
        const diff = moment().diff(birthDate, 'years');

        return diff >= 16;
    }
}