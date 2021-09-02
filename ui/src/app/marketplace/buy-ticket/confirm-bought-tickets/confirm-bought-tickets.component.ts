import { Component, Input, OnInit } from '@angular/core';
import { TicketAssignee, TicketsReservation } from '../models/tickets-reservation';

@Component({
  selector: 'app-confirm-bought-tickets',
  templateUrl: './confirm-bought-tickets.component.html',
  styleUrls: ['../../market-tickets/market-tickets.component.css', './confirm-bought-tickets.component.css']
})
export class ConfirmBoughtTicketsComponent implements OnInit {

    @Input() reservedTickets: TicketsReservation;
    @Input() users: Array<TicketAssignee>;
    
    summaryPrice = 0;

    constructor() { }

    ngOnInit(): void {
      if (this.reservedTickets.assignee) {
        this.summaryPrice += this.reservedTickets.priceForSale;
      }

      this.reservedTickets.tickets.forEach(ticket => {
        if (ticket.assignee) {
          this.summaryPrice += ticket.priceForSale;
        }
      });
    }

    removeTicket(i=null) {
      let user = null;
      if (i != null) {
        user = this.reservedTickets.tickets[i].assignee;
        this.reservedTickets.tickets[i].assignee = null;
        this.summaryPrice -= this.reservedTickets.tickets[i].priceForSale;
      } else {
        user = this.reservedTickets.assignee;
        this.reservedTickets.assignee = null;
        this.summaryPrice -= this.reservedTickets.priceForSale;
      }

      if (user) {
        this.users.push(user);
        this.users.sort((user1, user2) => { return user1.username.localeCompare(user2.username) });
      }
    }
}
