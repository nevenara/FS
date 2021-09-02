import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Environment } from 'src/app/environments/environment';
import { GetNonPersonalizedTicketsRequest } from 'src/app/services/models/get-non-personalized-tickets-request';
import { DateFormatter } from 'src/app/shared/date-formatter';
import { TicketPreviewModel } from 'src/app/tickets/models/ticket-preview-model';
import { TicketPersonalizationService } from '../../services/ticket-personalization-service';
import { EventModel } from '../models/event-model';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  tickets: Array<TicketPreviewModel> = [];
  pages: Array<number> = [];
  page = 1;

  loader = false;
  loadingError = false;

  eventImageUrl = Environment.serviceUrl + '/events/image?eventId=';

  dateFormatter: DateFormatter = new DateFormatter();

  constructor(private ticketPersonalizationService: TicketPersonalizationService, private translate: TranslateService) {}

  ngOnInit(): void {
    this.getNonPersonalizedTickets();
  }

  onPageChange(page) {
    this.page = page;
    this.getNonPersonalizedTickets();
  }

  getNonPersonalizedTickets() {
    this.loader = true;
    let request = new GetNonPersonalizedTicketsRequest();
    request.page = this.page;
    this.ticketPersonalizationService.getNonPersonalizedTickets(request).subscribe(response => {
      console.log(response);
      this.tickets = response.tickets;
      console.log(this.tickets);
      for (let i = 0; i < this.tickets.length; i++) {
        this.tickets[i].eventHash = this.getEventObject(i);
      }

      this.pages = [];
      for (let i = 0; i < response.totalPages; i++) {
          this.pages.push(i+1);
      }
      this.loader = false;
    }, error => {
      console.log(error);
      this.loader = false;
      this.loadingError = true;
    })
  }

  getEventObject(i) {
    let event = new EventModel();
    event.eventId = this.tickets[i].eventId;
    event.syncDate = this.tickets[i].syncDate;

    return btoa(JSON.stringify(event));
  }
}
