import { DbObject } from "../db/db-object";
import { Configs } from "../models/configs";
import { IConfigValue } from "./config-value";

export class ConfigDbObject extends DbObject {
    private configData: IConfigValue;

    constructor(configData?: IConfigValue) {
        super(configData);
        this.configData = this.data as any;
    }

    public get configs(): Configs {
        return this.configData.configs;
    }

    public set configs(v: Configs) {
        this.configData.configs = v;
    }
}