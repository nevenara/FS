import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Environment } from 'src/app/environments/environment';
import { TicketAssignee, TicketsReservation } from '../models/tickets-reservation';

@Component({
  selector: 'app-assign-bought-tickets',
  templateUrl: './assign-bought-tickets.component.html',
  styleUrls: ['../../market-tickets/market-tickets.component.css', './assign-bought-tickets.component.css']
})
export class AssignBoughtTicketsComponent implements OnInit, AfterViewInit {

    @Input() reservedTickets: TicketsReservation;
    @Input() usersList: Array<TicketAssignee>;
    @Output() assigneeNumberEmitter: EventEmitter<number> = new EventEmitter<number>();
    @Input() eventId: string;
    assigneeNumber = 0;
    users: Array<TicketAssignee>;
    seatImageUrl = Environment.serviceUrl + '/organizers/adminpanel/seatplanimage'
    seatImage = ""; 

    oldSelectValue = null;

    constructor(private modalService: NgbModal, private translate: TranslateService) { }
  
    ngAfterViewInit(): void {
      if(this.reservedTickets.assignee) {
        let index = this.users.indexOf(this.reservedTickets.assignee);

        if (index >= 0) {
          this.users.splice(index, 1);
        }
      }

      this.reservedTickets.tickets.forEach(ticket => {
        if(ticket.assignee) {
          let index = this.users.indexOf(ticket.assignee);

          if (index >= 0) {
            this.users.splice(index, 1);
          }
        }
      });
      this.seatImage = this.seatImageUrl + '?eventId=' + this.eventId + '&random=' + Math.random()

    }

    ngOnInit(): void {
      this.users = [...this.usersList];
      console.log(this.users)
    }

    openBackDropCustomClass(content) {
      console.log(content)
      this.modalService.open(content, {size: 'xl', centered: true, scrollable: true, backdropClass: 'light-blue-backdrop'});
    }

    onAssigneeSelect(newSelectValue) {
      if (this.oldSelectValue != null) {
        this.users.push(this.oldSelectValue);
        this.users.sort((user1, user2) => { return user1.username.localeCompare(user2.username) });
        this.assigneeNumber++;
      }

      if (newSelectValue != undefined) {
        let index = this.users.indexOf(newSelectValue);

        if (index >= 0) {
          this.users.splice(index, 1);
        }

        this.assigneeNumber--;
      }

      this.assigneeNumberEmitter.emit(this.assigneeNumber);
    }
}
