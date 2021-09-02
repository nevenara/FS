import { Component, Input, OnInit } from '@angular/core';
import { TicketsReservation } from '../models/tickets-reservation';

@Component({
  selector: 'app-buy-ticket-details',
  templateUrl: './buy-ticket-details.component.html',
  styleUrls: ['../../market-tickets/market-tickets.component.css', './buy-ticket-details.component.css']
})
export class BuyTicketDetailsComponent implements OnInit {

    @Input() reservedTickets: TicketsReservation;

    constructor() { }

    ngOnInit(): void {}

}
