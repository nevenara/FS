import { IDbData } from "../db/idb-data";

export interface IOrganizerValue extends IDbData {
    companyName: string;
    email: string;
    contactPerson: string;
    address: string;
    postCode: string;
    city: string;
    country: string;
    phone: string;
    url: string;
    status: string;
    ticketReturn: boolean;
    fansafeSale: boolean;
    linkLomnido: string;
    revenueSharing: number;
    created: Date;
}