import { Component, OnInit } from '@angular/core';
import { EditTicketService } from '../../services/edit-ticket-service';
import { GetDeleteTicketOnSaleRequest } from '../../services/models/get-delete-ticket-on-sale-request';
import { GetEditTicketOnSaleRequest } from '../../services/models/get-edit-ticket-on-sale-request';
import { TicketOnSaleRequest } from 'src/app/services/models/ticket-on-sale-request';
import { ActivatedRoute, Router } from '@angular/router';
import { Environment } from 'src/app/environments/environment';
import { TicketDetailsService } from 'src/app/services/ticket-details-service';
import { GetTicketDetailsRequest } from 'src/app/services/models/get-ticket-details-request';
import { TicketPreviewModel } from 'src/app/tickets/models/ticket-preview-model';
import { NotificationsService } from 'src/app/notifications/services/notifications.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DateFormatter } from 'src/app/shared/date-formatter';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-edit-ticket',
    templateUrl: './edit-ticket.component.html',
    styleUrls: ['./edit-ticket.component.css']
})

export class EditTicketComponent implements OnInit {

    details: TicketPreviewModel;
    loader = false;
    loadingError = false;
    ticketId: string;

    eventImageUrl = Environment.serviceUrl + '/events/image?eventId=';

    dateFormatter: DateFormatter = new DateFormatter();

    constructor(
        private editTicketService: EditTicketService,
        private ticketDetailsService: TicketDetailsService,
        private activatedroute: ActivatedRoute,
        private notificationsService: NotificationsService,
        private router: Router,
        private modalService: NgbModal,
        private translate: TranslateService
    ) { }

    ngOnInit(): void {
        this.activatedroute.params.subscribe(data => {
            this.ticketId = data['ticketId'];
            this.getTicketDetails();
           
        });
    }

    editTicket() {
        this.loader = true;
        let request = new GetEditTicketOnSaleRequest();
        request.tickets = [];

        let t: TicketOnSaleRequest = new TicketOnSaleRequest();
        t.price = this.details.priceForSale;
        t.ticketId = this.details.id;
        request.tickets.push(t);

        this.editTicketService.editTicketOnSale(request).subscribe(response => {
            console.log(response);
            this.loader = false;
            this.translate.get('notifications.marketplace.changesSaved').subscribe((data:any)=> {
                this.notificationsService.showSuccess(data);
              });
            this.router.navigateByUrl('/marketplace?type=2');
        }, error => {
            console.log(error);
            this.loader = false;
        })
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

    deleteTicket(): void {
        this.loader = true;
        let request = new GetDeleteTicketOnSaleRequest();
        request.tickets = [this.details.id];

        this.editTicketService.deleteTicketOnSale(request).subscribe(response => {
            console.log(response);
            this.loader = false;
            this.translate.get('notifications.marketplace.ticketRemovedFromSale').subscribe((data:any)=> {
                this.notificationsService.showSuccess(data);
              }); 
            this.router.navigateByUrl('/marketplace?type=2');
        }, error => {
            console.log(error);
            this.loader = false;
        });
    }

    getTicketDetails() {
        this.loader = true;
        let request = new GetTicketDetailsRequest();
        request.ticketId = this.ticketId;
        this.ticketDetailsService.getTicketDetails(request).subscribe(response => {
            this.details = response;
            console.log(this.details);
            console.log("price for sale is: " + this.details.priceForSale)
            this.loader = false;
        }, error => {
            console.log(error);
            this.loadingError = true;
            this.loader = false;
        });
    }

    openConfirmDeleteModal(content) {
        this.modalService.open(content, { size: 'md', centered: true }).result.then((result) => {
        }, (reason) => {
        });
    }
}


