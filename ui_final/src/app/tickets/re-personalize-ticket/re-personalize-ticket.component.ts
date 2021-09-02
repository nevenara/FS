import { Component, OnInit } from '@angular/core';
import { UserTicketsFromSameEventModel } from 'src/app/marketplace/edit-ticket/models/ticket-from-same-event';
import { TicketDetailsForRepersonalizationService } from '../../services/ticket-details-for-repersonalization'
import { GetTicketDetailsRequest } from '../../services/models/get-ticket-details-request';
import { GetUserInfoForRepersonalizationRequest } from '../../services/models/get-user-info-for-re-personalization-request'
import { UserInfoForRePersonalizationService } from '../../services/user-info-for-repersonalization-service'
import { userOrEmailPreviewModel } from './models/user-or-email-preview-model.ts'
import { Environment } from 'src/app/environments/environment';
import { PaymentType } from 'src/app/card-payment/types/payment-type';
import { ActivatedRoute } from '@angular/router';
import { DateFormatter } from 'src/app/shared/date-formatter';
import { GetUsernamesAndEmailsRequest } from 'src/app/services/models/get-usernames-and-emails-request';
import { merge, Observable, Subject } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-re-personalize-ticket',
    templateUrl: './re-personalize-ticket.component.html',
    styleUrls: ['./re-personalize-ticket.component.css']
})

export class RePersonalizeTicket implements OnInit {

    loader = false;
    loadingError = false;

    showModal = 1;
    ticketId: string;

    details: UserTicketsFromSameEventModel;
    userDetails: userOrEmailPreviewModel;
    usernameOrEmail: string;
    error: boolean;
    isChecked: boolean;
    errorMessage: string = "";
    seatImageUrl = Environment.serviceUrl + '/organizers/adminpanel/seatplanimage'
    seatImage = ""; 

    eventImageUrl = Environment.serviceUrl + '/events/image?eventId=';

    paymentType: PaymentType = PaymentType.RePersonalizeTicket;
    price = 0;
    inclFee = 1;
    fee = 0;
    percentage = 0;
    totalPrice = 5.32;

    dateFormatter: DateFormatter = new DateFormatter();

    ngOnInit(): void {
        this.activatedroute.params.subscribe(data => {
            this.ticketId = data['ticketId'];
            this.activatedroute.queryParams.subscribe(params => {
                if (params.payment_intent) {
                    if (params.redirect_status == 'succeeded') {
                        this.showModal = 3;
                    } else {
                        this.showModal = 4;
                        this.translate.get('notifications.tickets.paymentFailed').subscribe((data:any)=> {
                            this.errorMessage = data;
                        });
                    }
                } else {
                    this.error = false;
                    this.isChecked = false;
                    this.getTicketDetails();
                    this.getPaymentDetails();
                }
            });    
        });

    }

    constructor(
        private userInfoForRePersonalizationService: UserInfoForRePersonalizationService, 
        private ticketDetailsForRepersonalizationService: TicketDetailsForRepersonalizationService,
        private activatedroute: ActivatedRoute,
        private modalService: NgbModal,
        private translate: TranslateService

    ) {

    }

    getPaymentDetails() {
        this.ticketDetailsForRepersonalizationService.getPaymentDetails().subscribe(response => {
            this.fee = +response.percentage * 0.01 * +response.fixedFee + 0.25;
            this.percentage = +response.percentage;
            this.price = +response.fixedFee;
            this.totalPrice = this.price + this.fee;
        })
    }

    openBackDropCustomClass(content) {
        console.log(content)
        this.modalService.open(content, {size: 'xl', centered: true, scrollable: true, backdropClass: 'light-blue-backdrop'});
      }

    getTicketDetails() {
        this.loader = true;
        let request = new GetTicketDetailsRequest();
        request.ticketId = this.ticketId;
        this.ticketDetailsForRepersonalizationService.getUserTickets(request).subscribe(response => {
            this.details = response;
            this.loader = false;
            this.seatImage = this.seatImageUrl + '?eventId=' + response.eventId + '&random=' + Math.random()
        }, error => {
            console.log(error);
            this.loadingError = true;
            this.loader = false;
        });

       
    }

    checkUsernameOrEmail(){
        if (this.isChecked) {
            let request = new GetUserInfoForRepersonalizationRequest();
            request.usernameOrEmail = this.usernameOrEmail;
            
            this.userInfoForRePersonalizationService.getUserTickets(request).subscribe(response => {
                this.error = false;
                this.showModal = 2;
                this.userDetails = response;
                console.log(response);
            }, error => {
                this.error = true;
                console.log(error);
            });
        }
    }
}
