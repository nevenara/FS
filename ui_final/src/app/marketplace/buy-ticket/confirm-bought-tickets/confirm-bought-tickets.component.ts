import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BuyTicketService } from 'src/app/services/buy-ticket-service';
import { TicketAssignee, TicketsReservation } from '../models/tickets-reservation';

@Component({
  selector: 'app-confirm-bought-tickets',
  templateUrl: './confirm-bought-tickets.component.html',
  styleUrls: ['../../market-tickets/market-tickets.component.css', './confirm-bought-tickets.component.css']
})
export class ConfirmBoughtTicketsComponent implements OnInit {

    @Input() reservedTickets: TicketsReservation;
    @Output() assigneeNumberEmitter: EventEmitter<number> = new EventEmitter<number>();
    @Output() priceEmitter: EventEmitter<number> = new EventEmitter<number>();
    assigneeNumber = 0;

    summaryPrice = 0;
    totalPrice = 0;
    fee = 5;
    transactionFee = 0;
    feePrice = 0;  
    priceTax = 0;  
    tax = 0.13;
    percentage = 0;


    constructor(
      private buyTicketService: BuyTicketService,
      private translate: TranslateService
    ) { }

    ngOnInit(): void {
      if (this.reservedTickets.assignee) {
        this.summaryPrice += this.reservedTickets.priceForSale;
        this.assigneeNumber++;
      }

      for (let i = 0; i < this.reservedTickets.tickets.length; i++) {
        if (this.reservedTickets.tickets[i].assignee) {
          this.summaryPrice += this.reservedTickets.tickets[i].priceForSale;
          this.assigneeNumber++;
        }
      }

      this.calculatePrice();
    }

    removeTicket(i=null) {
      let user = null;
      if (i != null) {
        user = this.reservedTickets.tickets[i].assignee;
        this.reservedTickets.tickets[i].assignee = null;
        this.summaryPrice -= this.reservedTickets.tickets[i].priceForSale;
        this.assigneeNumber--;
      } else {
        user = this.reservedTickets.assignee;
        this.reservedTickets.assignee = null;
        this.summaryPrice -= this.reservedTickets.priceForSale;
        this.assigneeNumber--;
      }

      this.calculatePrice();
    }

    calculatePrice() {
      this.buyTicketService.getPaymentDetails({ticketId: this.reservedTickets.id}).subscribe(response => {
        this.priceTax = this.tax * this.summaryPrice;
        this.feePrice = this.assigneeNumber * this.fee;
        this.percentage = response.percentage;
        this.transactionFee = +response.percentage * 0.01 * (this.summaryPrice + this.feePrice) + 0.25;
        this.totalPrice = +response.total;

        this.priceEmitter.emit(this.totalPrice);
        this.assigneeNumberEmitter.emit(this.assigneeNumber);
      })
    }
}
