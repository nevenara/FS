import { DateUtil } from "./date";
import { serializeError } from "serialize-error";

export interface IAppLogger{
    error(error: any, ...optionalParams: any[]);
    log(content: string, ...optionalParams: any[]): void
}

export class AppLogger implements IAppLogger{
    constructor(private guid: string = null){}
   

    public log(content: string, ...optionalParams: any[]): void{
        const logObject: string = this.getLogObject(content, optionalParams);

        console.log(logObject);
    }

    public error(content: any, ...optionalParams: any[]) {
        const logObject: string = this.getLogObject(content, optionalParams);

        console.error(logObject);
    }

    private getLogObject(content: string, optionalParams?: any[]): string {
        const optionalStringParams: string[] = this.stringifyOptionalParams(optionalParams);
        const stringifiedContent: string = this.stringifyParam(content);

        const logObject: string = this.prepareLogObject(stringifiedContent, optionalStringParams);

        return logObject;
    }

    private prepareLogObject(content: string, optionalStringParams: string[]) {
        const messageArray: string[] = [content, ...optionalStringParams];
        const message: string = messageArray.join(' ');

        return JSON.stringify({
            guid: this.guid,
            msg: message,
            date: DateUtil.getUTCTimestamp(),
        });
    }

    private stringifyOptionalParams(optionalParams?: any[]): string[] {
        return optionalParams.map((x: any) => this.stringifyParam(x));
    }

    private stringifyParam(param: any): string {
        if (typeof param == "string") {
            return param;
        }

        if (param instanceof Date) {
            return DateUtil.getUTCTimestamp(param);
        }

        if (param instanceof Error) {
            return JSON.stringify(serializeError(param));
        }

        return JSON.stringify(param);
    }
}