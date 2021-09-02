import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Environment } from 'src/app/environments/environment';
import { DateFormatter } from 'src/app/shared/date-formatter';
import { TicketPreview } from '../../models/ticket-preview';
import { GetAdminTicketDetailsRequest } from '../../services/models/get-admin-ticket-details-request';
import { SearchTicketChangeHistoryRequest } from '../../services/models/search-ticket-change-history-request';
import { TicketService } from '../../services/ticket-service';
import { TicketChangeHistoryPreview } from '../../models/ticket-change-history-preview';
import { saveAs } from "file-saver";
import { AssignTicketRequest } from '../../services/models/assign-ticket-request';
import { NotificationsService } from 'src/app/notifications/services/notifications.service';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { merge, Observable, Subject } from 'rxjs';
import { SearchByFirstAndLastNameRequest } from '../../services/models/search-by-first-and-last-name-request';
import { AuthenticationService } from 'src/app/services/authentication-service';
import { UserType } from 'src/app/services/models/user-context';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
  editing: boolean = false;
  firstname: string = '';
  lastname: string = '';
  username: string = '';
  userIds = [];
  usernames = [];

  ticketId: string;

  ticket: TicketPreview = new TicketPreview();

  loader = false;
  loadingError = false;

  eventImageUrl = Environment.serviceUrl + '/events/image?eventId=';
  dateFormatter: DateFormatter = new DateFormatter();

  pages = [];
  totalRecords = 15;

  showLimits = [10, 25, 50];

  loaderHistory = false;

  searchActive = false;
  search;
  focus$ = new Subject<string>();

  searchTicketChangeHistoryRequest: SearchTicketChangeHistoryRequest = new SearchTicketChangeHistoryRequest();
  searchTicketChangeHistoryPreview: Array<TicketChangeHistoryPreview> = [];

  userType: UserType;

  constructor(
    private activatedRoute: ActivatedRoute,
    private ticketService: TicketService,
    private notificationsService: NotificationsService,
    private authService: AuthenticationService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(data => {
      this.ticketId = data['ticketId'];
      this.getUserType();
      this.getTicketDetails();
      this.searchTicketChangeHistoryRequest.limit = this.showLimits[0];
      this.searchTicketChangeHistoryRequest.ticketId = this.ticketId;
      this.searchTicketChangeHistory();
    });
  }

  getUserType() {
    this.authService.getUserType().subscribe(response => {
      this.userType = response.userType;
    })
  }
  
  
  startEditing(i) {
    this.firstname = '';
    this.lastname = '';
    this.editing = true;

    if (this.firstname && this.lastname) {
      this.getUsernameOptions();
    }
  }

  cancelEditing() {
    this.firstname = '';
    this.lastname = '';
    this.editing = false;
  }

  onNameChange() {
    if (this.firstname && this.lastname) {
      this.username = '';
      this.getUsernameOptions();
    } else {
      this.searchActive = false;
    }
  }

  getUsernameOptions() {
    let request: SearchByFirstAndLastNameRequest = new SearchByFirstAndLastNameRequest();
    request.firstname = this.firstname;
    request.lastname = this.lastname;
    
    this.ticketService.searchByFirstAndLastName(request).subscribe(response => {
      this.usernames = [];
      this.userIds = [];

      for (let i = 0; i < response.data.length; i++) {
        this.usernames.push(response.data[i].usernameAndEmail);
        this.userIds.push(response.data[i].userId);
      }

      this.search = (text$: Observable<string>) =>  {
        let inputFocus$ = this.focus$;
        return merge(text$, inputFocus$).pipe(
          distinctUntilChanged(),
          map(term => this.usernames.filter(username => new RegExp(term.replace(/([!@#$%^&*()+=\[\]\\';,./{}|":<>?~_-])/g, "\\$1"), 'mi').test(username)))
        )
    }
      this.searchActive = true;
    }, error => {
      this.search = (text$: Observable<string>) =>  {
          let inputFocus$ = this.focus$;
          return merge(text$, inputFocus$).pipe(
            distinctUntilChanged(),
            map(term => [].filter(username => new RegExp(term, 'mi').test(username)))
          )
      }
      this.searchActive = true;
    })
  }

  assignTicket() {
    let request: AssignTicketRequest = new AssignTicketRequest();

    request.ticketId = this.ticketId;
    let index = this.usernames.indexOf(this.username);
    request.userId = this.userIds[index];
    request.firstname = this.firstname;
    request.lastname = this.lastname;

    this.ticketService.assignTicket(request).subscribe(response => {
      this.cancelEditing();
      this.getTicketDetails();
      this.searchTicketChangeHistoryRequest.limit = this.showLimits[0];
      this.searchTicketChangeHistoryRequest.ticketId = this.ticketId;
      this.searchTicketChangeHistory();
      this.notificationsService.showSuccess('Personalization successfully updated');
    }, error => {

    })
  }

  getTicketDetails() {
    this.loader = true;
    let request = new GetAdminTicketDetailsRequest();
    request.ticketId = this.ticketId;

    this.ticketService.getTicketDetails(request).subscribe(response => {
      console.log(response);
      this.ticket = response;
      this.loader = false;
    }, error => {
      console.log(error);
      this.loader = false;
      this.loadingError = true;
    })
  }

  next() {
    if (this.searchTicketChangeHistoryRequest.page < this.pages.length) {
      this.searchTicketChangeHistoryRequest.page++;
      this.searchTicketChangeHistory(true);
    }
  }

  previous() {
    if (this.searchTicketChangeHistoryRequest.page > 1) {
      this.searchTicketChangeHistoryRequest.page--;
      this.searchTicketChangeHistory(true);
    }
  }

  getFromPage() {
    return (this.searchTicketChangeHistoryRequest.page - 1) * this.searchTicketChangeHistoryRequest.limit + 1;
  }

  getToPage() {
    return Math.min(this.searchTicketChangeHistoryRequest.page * this.searchTicketChangeHistoryRequest.limit, this.totalRecords);
  }

  onPageChange(page) {
    console.log(page);
    this.searchTicketChangeHistoryRequest.page = page;
    this.searchTicketChangeHistory(true);
  }

  onLimitChange() {
    this.searchTicketChangeHistory();
  }

  getOrdinalNumber(i) {
    return (this.searchTicketChangeHistoryRequest.page - 1) * this.searchTicketChangeHistoryRequest.limit + i + 1;
  }

  searchTicketChangeHistory(changePage = false) {
    if (!changePage) {
      this.searchTicketChangeHistoryRequest.page = 1;
    }
    
    this.loaderHistory = true;
    
    this.ticketService.searchTicketChangeHistory(this.searchTicketChangeHistoryRequest).subscribe(response => {
      console.log(response);
      this.searchTicketChangeHistoryPreview = response.data;
      this.totalRecords = response.totalRecords;
      this.pages = [];
      for (let i = 0; i < response.totalPages; i++) {
        this.pages.push(i + 1);
      }
      this.loaderHistory = false;
    }, error => {
      console.log(error);
      this.loaderHistory = false;
    })
  }

  exportExcel() {
    this.ticketService.exportChangeHistoryExcel(this.searchTicketChangeHistoryRequest).subscribe(response => {
      saveAs(response, 'ticketChangeHistory');
    }, error => {
      console.log(error);
    });
  }

  exportCsv() {
    this.ticketService.exportChangeHistoryCsv(this.searchTicketChangeHistoryRequest).subscribe(response => {
      saveAs(response, 'ticketChangeHistory.csv');
    }, error => {
      console.log(error);
    });
  }

  exportPdf() {
    this.ticketService.exportChangeHistoryPdf(this.searchTicketChangeHistoryRequest).subscribe(response => {
      saveAs(response, 'ticketChangeHistory');
    }, error => {
      console.log(error);
    });
  }
}
