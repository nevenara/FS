import { IDbData } from "../db/idb-data";
import { FAQCategory } from "./models/faq-category";

export interface IFAQValue extends IDbData {
    question: string;
    answer: string;
    lastUpdate: Date;
    likes: number;
    dislikes: number;
    category: FAQCategory;
}
