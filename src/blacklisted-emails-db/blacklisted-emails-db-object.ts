import { DbObject } from "../db/db-object";
import { IBlacklistedEmailsValue } from "./blacklisted-emails-value";

export class BlacklistedEmailsDbObject extends DbObject{
    private blacklistedEmailsData: IBlacklistedEmailsValue; 

    constructor(blacklistedEmailsData?: IBlacklistedEmailsValue){
        super(blacklistedEmailsData);
        this.blacklistedEmailsData = this.data as any;
    }
    
    public get domain(): string {
        return this.blacklistedEmailsData.domain;
    }
    public set domain(v: string) {
        this.blacklistedEmailsData.domain = v;
    }

    public static DomainFieldName = "domain";
}