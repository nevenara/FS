import { Component, Input, OnInit } from '@angular/core';
import { CancelReservationRequest } from 'src/app/services/models/cancel-reservation-request';
import { ReserveTicketsRequest } from 'src/app/services/models/reserve-tickets-request';
import { BuyTicketService } from '../../services/buy-ticket-service';
import { TicketAssignee, TicketsReservation } from './models/tickets-reservation';

@Component({
  selector: 'app-buy-ticket',
  templateUrl: './buy-ticket.component.html',
  styleUrls: ['../market-tickets/market-tickets.component.css', './buy-ticket.component.css']
})
export class BuyTicketComponent implements OnInit {
    
    @Input() ticketId: string;
    @Input() show: number;

    reservedTickets: TicketsReservation;
    users: Array<TicketAssignee> = [];
    counter = 0;

    constructor(private buyTicketService: BuyTicketService) { }

    ngOnInit(): void {
      this.getAssigneeUsernames();
      this.reserveTickets();
    }

    next() {
      this.show ++;
  
      if(this.show >= 4) {
        this.show = 1;
      }
    }
  
    previous() {
      this.show --;
  
      if(this.show < 1) {
          this.show = 3;
      }
    }

    getAssigneeUsernames() {
      this.buyTicketService.getAssigneeUsernames().subscribe(response => {
        this.users = response.users;
        this.users.sort((user1, user2) => { return user1.username.localeCompare(user2.username) });
      }, error => {
        console.log(error);
      })
    }

    reserveTickets(): void {
      let request = new ReserveTicketsRequest();
      request.ticketId = this.ticketId;
      this.buyTicketService.reserveTickets(request).subscribe(response => {
          console.log(response);
          this.reservedTickets = response;
          for (let i = 0; i < this.reservedTickets.placeholderImages.length; i++) {
              this.reservedTickets.placeholderImages[i].image = 
              "data:" 
              + this.reservedTickets.placeholderImages[i].mimetype 
              + ";base64," 
              + this.reservedTickets.placeholderImages[i].image;
          }
          this.counter = this.reservedTickets.reservationTime * 60;

          this.reservedTickets.assignee = null;
          for (let i = 0; i < this.reservedTickets.tickets.length; i++) {
            this.reservedTickets.tickets[i].assignee = null;
          }
        }, error => {
          console.log(error);
      });
    }

    cancelReservation(): void {
      let request: CancelReservationRequest = new CancelReservationRequest();
      request.tickets = [];

      this.reservedTickets.tickets.forEach(ticket => {
        request.tickets.push(ticket.id);
      });

      this.buyTicketService.cancelReservation(request).subscribe(response => {
        console.log(response);
      }, error => {
        console.log(error);
      })
    }
    
}
