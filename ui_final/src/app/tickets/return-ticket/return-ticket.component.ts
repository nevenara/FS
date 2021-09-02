import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserTicketsFromSameEventModel } from '../../marketplace/edit-ticket/models/ticket-from-same-event';
import { ReturnTicketRequest } from '../../services/models/get-return-ticket-request';
import { ReturnTicketService } from '../../services/return-ticket-service';
import { GetTicketDetailsRequest } from 'src/app/services/models/get-ticket-details-request';
import { TicketDetailsService } from 'src/app/services/ticket-details-service';
import { Environment } from 'src/app/environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationsService } from 'src/app/notifications/services/notifications.service';
import { DateFormatter } from 'src/app/shared/date-formatter';
import { TranslateService } from '@ngx-translate/core';
import { LocalisationService } from 'src/app/localisation/services/localisation.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-return-ticket',
    templateUrl: './return-ticket.component.html',
    styleUrls: ['./return-ticket.component.css'],
})
export class ReturnTicket implements OnInit, OnDestroy {
    ticketId: string;

    details: UserTicketsFromSameEventModel;
    selectedReason: any;
    returnReason: Array<any> 
    returnReasonEn: Array<any>
    isChecked: boolean;
    
    eventImageUrl = Environment.serviceUrl + '/events/image?eventId=';

    loader = false;
    loadingError = false;

    dateFormatter: DateFormatter = new DateFormatter();

    changeLanguageSubscription: Subscription;

    filterTranslationKeys = [
        'reasonsForReturn.personalizationDeadline',
        'reasonsForReturn.illness',
        'reasonsForReturn.professionalReasons',
        'reasonsForReturn.other'
    ]

    ngOnInit(): void {
        this.isChecked = false;
        this.returnReasonEn = [
            'Personalization deadline expired',
            'Illness',
            'For professional reasons',
            'Other'
        ];

        this.setLanguage();
        this.changeLanguageSubscription = this.localisationService.changeLanguage$.subscribe(() => {
            this.setLanguage();
        })

        this.activatedroute.params.subscribe(data => {
            this.ticketId = data['ticketId'];
            this.getTicketDetails();
        });
    }

    ngOnDestroy() {
        this.changeLanguageSubscription.unsubscribe();
    }

    constructor(
        private ticketDetailsService: TicketDetailsService,
        private returnTicketService: ReturnTicketService,
        private activatedroute: ActivatedRoute,
        private router: Router,
        private notificationsService: NotificationsService,
        private translate: TranslateService,
        private localisationService: LocalisationService
    ) {
        
    }

    setLanguage() {
        this.returnReason = [
            { item_id: 1, item_text: 'Personalization deadline expired'},
            { item_id: 2, item_text:'Illness' },
            { item_id: 3, item_text:'For professional reasons' },
            { item_id: 4, item_text:'Other' }
        ];

        for (let i = 0; i < this.filterTranslationKeys.length; i++) {
            this.translate.get(this.filterTranslationKeys[i]).subscribe((data:any)=> {
                if (this.selectedReason && this.selectedReason.item_id == this.returnReason[i].item_id) {
                    this.selectedReason = null;
                    this.selectedReason = {item_id: this.returnReason[i].item_id, item_text: data};
                }
                this.returnReason[i].item_text = data;
            });
        }
    }

    getTicketDetails() {
        this.loader = true;
        let request = new GetTicketDetailsRequest();
        request.ticketId = this.ticketId;
        this.ticketDetailsService.getTicketDetails(request).subscribe(
            (response) => {
                console.log(response);
                this.details = response;
                this.loader = false;
            },
            (error) => {
                console.log(error);
                this.loadingError = true;
                this.loader = false;
            }
        );
    }

    returnTicket() {
        if(this.isChecked == true && this.selectedReason){
            this.loader = true;
            let request = new ReturnTicketRequest();
            request.id = this.ticketId;
            request.reasonTicketReturn = this.returnReasonEn[this.selectedReason.item_id - 1];
            request.acceptedReturnPolicy = this.isChecked;

            this.returnTicketService.returnTicket(request).subscribe(
                (response) => {
                    console.log(response);
                    this.loader = false;
                    this.translate.get('notifications.tickets.ticketReturned').subscribe((data:any)=> {
                        this.notificationsService.showSuccess(data);
                    });
                    this.router.navigateByUrl('/tickets');
                },
                (error) => {
                    console.log(error);
                    this.loader = false;
                }
            );
    }
    }
}
