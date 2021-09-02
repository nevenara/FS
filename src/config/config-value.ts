import { IDbData } from "../db/idb-data";
import { Configs } from "../models/configs";

export interface IConfigValue extends IDbData {
    configs: Configs;
}