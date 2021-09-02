import { Component, Input, OnInit } from '@angular/core';
import { TicketAssignee, TicketsReservation } from '../models/tickets-reservation';

@Component({
  selector: 'app-assign-bought-tickets',
  templateUrl: './assign-bought-tickets.component.html',
  styleUrls: ['../../market-tickets/market-tickets.component.css', './assign-bought-tickets.component.css']
})
export class AssignBoughtTicketsComponent implements OnInit {

    @Input() reservedTickets: TicketsReservation;
    @Input() users: Array<TicketAssignee>;

    oldSelectValue = null;

    constructor() { }

    ngOnInit(): void {}

    onAssigneeSelect(newSelectValue) {
      if (this.oldSelectValue != null) {
        this.users.push(this.oldSelectValue);
        this.users.sort((user1, user2) => { return user1.username.localeCompare(user2.username) });
      }

      if (newSelectValue != undefined) {
        let index = this.users.indexOf(newSelectValue);

        if (index >= 0) {
          this.users.splice(index, 1);
        }
      }
    }
}
