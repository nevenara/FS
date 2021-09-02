import { DbObject } from "../db/db-object";
import { IFAQValue } from "./faq-value";
import { FAQCategory } from "./models/faq-category";

export class FAQDbObject extends DbObject{
    private faqData: IFAQValue;

    constructor(faqValue?: IFAQValue){
        super(faqValue);
        this.faqData = this.data as any;
    }

    public get question() : string {
        return this.faqData.question;
    }

    public set question(v : string) {
        this.faqData.question = v;
    }
    
    public get answer() : string {
        return this.faqData.answer;
    }

    public set answer(v : string) {
        this.faqData.answer = v;
    }

    public get lastUpdate() : Date {
        return this.faqData.lastUpdate;
    }

    public set lastUpdate(v : Date) {
        this.faqData.lastUpdate = v;
    }
    
    public get likes() : number {
        return this.faqData.likes;
    }
    
    public set likes(v : number) {
        this.faqData.likes = v;
    }

    public get dislikes() : number {
        return this.faqData.dislikes;
    }
    
    public set dislikes(v : number) {
        this.faqData.dislikes = v;
    }
    
    public set category(v : FAQCategory) {
        this.faqData.category = v;
    }

    public get category() : FAQCategory {
        return this.faqData.category;
    }

    public static FAQIdFieldName = "id";
  
}
