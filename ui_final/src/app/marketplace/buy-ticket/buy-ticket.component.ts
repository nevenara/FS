import { Component, OnInit } from '@angular/core';
import { CancelReservationRequest } from 'src/app/services/models/cancel-reservation-request';
import { ReserveTicketsRequest } from 'src/app/services/models/reserve-tickets-request';
import { BuyTicketService } from '../../services/buy-ticket-service';
import { TicketAssignee, TicketsReservation } from './models/tickets-reservation';
import { PaymentType } from 'src/app/card-payment/types/payment-type';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Environment } from 'src/app/environments/environment';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-buy-ticket',
  templateUrl: './buy-ticket.component.html',
  styleUrls: ['../market-tickets/market-tickets.component.css', './buy-ticket.component.css']
})

export class BuyTicketComponent implements OnInit {
    eventId: string;
    ticketId: string;
    reservedTickets: TicketsReservation;
    users: Array<TicketAssignee> = [];
    counter = 0;
    loader = false;
    loadingError = false;
    show = 1;
    successPayment = false;
    seatImageUrl = Environment.serviceUrl + '/organizers/adminpanel/seatplanimage'
    seatImage = ""; 
    
    paymentType: PaymentType = PaymentType.BuyTicket;
    
    errorMessage = '';
    assigneeNumber = 0;
    price = 0;

    constructor(
      private buyTicketService: BuyTicketService,
      private activatedroute: ActivatedRoute,
      private router: Router,
      private modalService: NgbModal,
      private translate: TranslateService
    ) { 
      
    }

    ngOnInit(): void {
      this.activatedroute.params.subscribe(data => {
        this.ticketId = data['ticketId'];
        this.activatedroute.queryParams.subscribe(params => {
          if (params.payment_intent) {
            if (params.redirect_status == 'succeeded') {
              this.show = 5;
            } else {
              this.show = 4;
              this.translate.get('notifications.marketplace.paymentFailed').subscribe((data:any)=> {
                this.errorMessage = data;
              }); 
            }
          } else {
            this.reserveTickets(); 
          }
        });
        
      });
     
    }

    reserveTickets(): void {
      this.loader = true;
      let request = new ReserveTicketsRequest();
      request.ticketId = this.ticketId;
      this.buyTicketService.reserveTickets(request).subscribe(response => {
          console.log(response);
          console.log(response.eventId)
          this.eventId = response.eventId
          this.seatImage = this.seatImageUrl + '?eventId=' + this.eventId + '&random=' + Math.random()
          this.reservedTickets = response;
          
          this.counter = this.reservedTickets.reservationTime * 60;

          this.reservedTickets.assignee = null;
          for (let i = 0; i < this.reservedTickets.tickets.length; i++) {
            this.reservedTickets.tickets[i].assignee = null;
          }

          this.buyTicketService.getAssigneeUsernames().subscribe(response => {
            this.users = response.users;
            
            this.users.sort((user1, user2) => { return user1.username.localeCompare(user2.username) });

            if (this.users.length == 1) {
              this.show = 2;
              this.reservedTickets.assignee = this.users[0];
            }

            this.loader = false;
          }, error => {
            console.log(error);
            this.loader = false;
            this.loadingError = true;
          })
        }, error => {
          this.loader = false;
          this.loadingError = true;
          console.log(error);
      });
    }

    openBackDropCustomClass(content) {
      console.log(content)
      this.modalService.open(content, {size: 'xl', centered: true, scrollable: true, backdropClass: 'light-blue-backdrop'});
    }

    cancelReservation(): void {
      if (this.show != 4 && this.show != 5) {
        let request: CancelReservationRequest = new CancelReservationRequest();
        request.tickets = [];

        request.tickets.push(this.reservedTickets.id);

        this.reservedTickets.tickets.forEach(ticket => {
          request.tickets.push(ticket.id);
        });

        this.buyTicketService.cancelReservation(request).subscribe(response => {
          console.log(response);
        }, error => {
          console.log(error);
        })
      }
      
      this.router.navigateByUrl('/marketplace');
    }

    changeAssigneeNumber(number) {
      this.assigneeNumber = number;
      if (number == 0) {
        if (this.users.length == 1) {
          this.router.navigateByUrl('/marketplace');
        } else {
          this.show = 1;
        }
      }
    }
}
