export class DateUtil {
    public static getUTCTimestamp(date: Date = new Date()): string {
        return date.toISOString();
    }

    public static getUTCTime(date: Date = new Date()): string {
        return `${date.getUTCHours().toLocaleString("en", {
            minimumIntegerDigits: 2,
        })}:${date.getUTCMinutes().toLocaleString("en", {
            minimumIntegerDigits: 2,
        })}:${date.getUTCSeconds().toLocaleString("en", {
            minimumIntegerDigits: 2,
        })}`;
    }

    public static getUTCDate(date: Date = new Date()): string {
        return `${date.getUTCFullYear()}-${date.getUTCMonth().toLocaleString("en", {
            minimumIntegerDigits: 2,
        })}-${date.getUTCDate().toLocaleString("en", {
            minimumIntegerDigits: 2,
        })}`;
    }
    public static getUTCSecondDate(date: Date = new Date()): string {
        return `${date.getUTCFullYear()}-${date.getUTCMonth().toLocaleString("en", {
            minimumIntegerDigits: 2,
        })}-${date.getUTCDate().toLocaleString("en", {
            minimumIntegerDigits: 2,
        })}T${date.getUTCHours().toLocaleString("en", {
            minimumIntegerDigits: 2,
        })}:${date.getUTCMinutes().toLocaleString("en", {
            minimumIntegerDigits: 2,
        })}:${date.getUTCSeconds().toLocaleString("en", {
            minimumIntegerDigits: 2,
        })}`;
    }

    public static GetDateTimeStampUTC(date: Date = new Date()): Date {
        return new Date(
            Date.UTC(
                date.getUTCFullYear(),
                date.getUTCMonth(),
                date.getUTCDate(),
                date.getUTCHours(),
                date.getUTCMinutes(),
                date.getUTCSeconds(),
                date.getUTCMilliseconds(),
            ),
        );
    }

    public static GetEndOfTime(): Date {
        return new Date(Date.UTC(2200, 1, 1, 0, 0, 0, 0));
    }

    public static getCurrentTimeInMiliseconds(): number {
        return new Date().getTime();
    }

    public static getCurrentUTCTimeInMiliseconds(): number {
        // TODO remove this because the milliseconds are time zone agnostic.
        return this.GetDateTimeStampUTC().getTime();
    }

    public static getDateInMiliseconds(date: Date): number {
        return date.getTime();
    }
}
