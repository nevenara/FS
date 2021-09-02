import { Component, Input,  OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Environment } from 'src/app/environments/environment';
import { DateFormatter } from 'src/app/shared/date-formatter';
import { TicketsReservation } from '../models/tickets-reservation';

@Component({
  selector: 'app-ticket-details',
  templateUrl: './ticket-details.component.html',
  styleUrls: ['./ticket-details.component.css']
})
export class TicketDetailsComponent implements OnInit {

    @Input('reservedTickets') reservedTickets: TicketsReservation; 
    eventImageUrl = Environment.serviceUrl + '/events/image?eventId=';

    dateFormatter: DateFormatter = new DateFormatter();
    
    constructor(private translate: TranslateService) { }

    ngOnInit(): void {
    }

}