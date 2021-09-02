import { Component, OnInit } from '@angular/core';
import { UserTicketsForSaleFromSameEventModel } from './models/ticket-for-sale-from-same-event-model';
import { GetUserTicketsFromSameEventRequest } from 'src/app/services/models/get-user-tickets-from-same-event-request';
import { TicketOnSaleRequest } from 'src/app/services/models/ticket-on-sale-request';
import { UserTicketsFromSameEventService } from 'src/app/services/user-tickets-from-same-event-service';
import { GetSellTicketRequest } from '../../services/models/get-sell-ticket-request'
import { SellTicketService } from '../../services/sell-ticket-service'
import { Environment } from 'src/app/environments/environment';
import { UserProfileService } from 'src/app/services/user-profile-service';
import { UpdateBankAccountModalService } from 'src/app/account/update-bank-account/services/update-bank-account-modal-service';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationsService } from 'src/app/notifications/services/notifications.service';
import { TicketPreviewModel } from '../models/ticket-preview-model';
import { TicketDetailsService } from 'src/app/services/ticket-details-service';
import { GetTicketDetailsRequest } from 'src/app/services/models/get-ticket-details-request';
import { DateFormatter } from 'src/app/shared/date-formatter';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-sell-ticket',
    templateUrl: './sell-ticket.component.html',
    styleUrls: ['./sell-ticket.component.css']
})

export class SellTicketComponent implements OnInit {

    loader = false;
    loadingError = false;
    

    ticketId: string;
    details: TicketPreviewModel;

    eventImageUrl = Environment.serviceUrl + '/events/image?eventId=';

    dateFormatter: DateFormatter = new DateFormatter();

    isSubmitted = false;

    constructor(
        private ticketDetailsService: TicketDetailsService,
        private sellTicketService: SellTicketService,
        private activatedroute: ActivatedRoute,
        private notificationsService: NotificationsService,
        private router: Router,
        private translate: TranslateService
    ) {

    }

    ngOnInit(): void {
        this.activatedroute.params.subscribe(data => {
            this.loader = true;
            this.ticketId = data['ticketId'];
            this.getTicketDetails();
        });
    }


    validatePrice(event: any) {
        
        if(!this.details.priceForSale){
            this.details.priceForSale = +this.details.priceForSale 
        }
        var regex = new RegExp("^[0-9][0-9]*[.,,]?[0-9]{0,1}$");
        if (event.keyCode != "8" || !this.details.priceForSale) {
            if (!this.details.priceForSale.toString().match(regex)){
                event.preventDefault();
            }
        }
    }

    roundPrice(){
        if(!this.details.priceForSale){
            this.details.priceForSale = 0
        }
        console.log(this.details.priceForSale + "isPrice")
        var regexLeadingZero = new RegExp("^(0[0-9]+|0)")
        if(this.details.priceForSale.toString().match(regexLeadingZero)){
            console.log("isLeadingZero")
            this.details.priceForSale = +this.details.priceForSale
        }
    }

    getTicketDetails() {
        let request = new GetTicketDetailsRequest();
        request.ticketId = this.ticketId;
        this.ticketDetailsService.getTicketDetails(request).subscribe(response => {

            this.details = response;
            this.loader = false;
        }, error => {
            console.log(error);
            this.loadingError = true;
            this.loader = false;
        });
    }

    sellTicket() {
        this.isSubmitted = true;
        if (!this.details.priceForSale || this.details.originalPrice > this.details.originalPrice) {
            return;
        }

        this.loader = true;

        let request = new GetSellTicketRequest();
        request.tickets = [];

        let t: TicketOnSaleRequest = new TicketOnSaleRequest();
        t.price = this.details.priceForSale;
        t.ticketId = this.details.id;
        request.tickets.push(t);

        this.sellTicketService.sellTicket(request).subscribe(response => {
            console.log(response)
            this.loader = false;
            this.translate.get('notifications.tickets.ticketOfferPlaced').subscribe((data:any)=> {
                this.notificationsService.showSuccess(data);
            });
            this.router.navigateByUrl('/marketplace?type=2');
        }, error => {
            console.log(error);
            this.loader = false;
        })
    }

}


