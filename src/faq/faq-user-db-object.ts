import { DbObject } from "../db/db-object";
import { IFAQUserValue } from "./faq-user-value";

export class FAQUserDbObject extends DbObject{
    private faqData: IFAQUserValue;

    constructor(faqValue?: IFAQUserValue){
        super(faqValue);
        this.faqData = this.data as any;
    }

    public get userId() : string {
        return this.faqData.userId;
    }

    public set userId(v : string) {
        this.faqData.userId = v;
    }
    
    public get faqId() : string {
        return this.faqData.faqId;
    }

    public set faqId(v : string) {
        this.faqData.faqId = v;
    }

    public get like() : boolean {
        return this.faqData.like;
    }

    public set like(v : boolean) {
        this.faqData.like = v;
    }
  
}
