import { DbObject } from "../db/db-object";
import { IOrganizerValue } from "./organizer-value";

export class OrganizerDbObject extends DbObject{
    private organizerData: IOrganizerValue;

    constructor(organizerValue?: IOrganizerValue){
        super(organizerValue);
        this.organizerData = this.data as any;
    }
    
    public get companyName() : string {
        return this.organizerData.companyName;
    }

    public set companyName(v : string) {
        this.organizerData.companyName = v;
    }
    
    public get email() : string {
        return this.organizerData.email;
    }
    
    public set email(v : string) {
        this.organizerData.email = v;
    }
    
    public get contactPerson() : string {
        return this.organizerData.contactPerson;
    }
    
    public set contactPerson(v : string) {
        this.organizerData.contactPerson = v;
    }

    public get address() : string {
        return this.organizerData.address;
    }
    
    public set address(v : string) {
        this.organizerData.address = v;
    }

    public get postCode() : string {
        return this.organizerData.postCode;
    }
    
    public set postCode(v : string) {
        this.organizerData.postCode = v;
    }
    

    public get city() : string {
        return this.organizerData.city;
    }
    
    public set city(v : string) {
        this.organizerData.city = v;
    }

    public get country() : string {
        return this.organizerData.country;
    }
    
    public set country(v : string) {
        this.organizerData.country = v;
    }

    public get phone() : string {
        return this.organizerData.phone;
    }
    
    public set phone(v : string) {
        this.organizerData.phone = v;
    }

    public get url() : string {
        return this.organizerData.url;
    }
    
    public set url(v : string) {
        this.organizerData.url = v;
    }

    public get status() : string {
        return this.organizerData.status;
    }
    
    public set status(v : string) {
        this.organizerData.status = v;
    }

    public get linkLomnido() : string {
        return this.organizerData.linkLomnido;
    }
    
    public set linkLomnido(v : string) {
        this.organizerData.linkLomnido = v;
    }

    public get ticketReturn(): boolean {
        return this.organizerData.ticketReturn;
    }

    public set ticketReturn(v: boolean) {
        this.organizerData.ticketReturn = v;
    }

    public get fansafeSale(): boolean {
        return this.organizerData.fansafeSale;
    }

    public set fansafeSale(v: boolean) {
        this.organizerData.fansafeSale = v;
    }

    public get revenueSharing(): number {
        return this.organizerData.revenueSharing;
    }

    public set revenueSharing(v: number) {
        this.organizerData.revenueSharing = v;
    }

    public get created(): Date {
        return this.organizerData.created;
    }

    public set created(v: Date) {
        this.organizerData.created = v;
    }

}
