import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { EventModel } from '../models/event-model';
import { ActivatedRoute, Router } from '@angular/router';
import { TicketPersonalizationService } from 'src/app/services/ticket-personalization-service';
import { GetNonPersonalizedTicketsByEventRequest } from 'src/app/services/models/get-non-personalized-tickets-by-event-request';
import { TicketPreviewModel } from 'src/app/tickets/models/ticket-preview-model';
import { AssignTicketRequest, TicketToAssign } from 'src/app/services/models/assign-ticket-request';
import { OpenIdVerificationModalService } from '../../id-verification/services/open-id-verification-modal.service';
import { Environment } from 'src/app/environments/environment';
import { DateFormatter } from 'src/app/shared/date-formatter';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { merge, Observable, Subject } from 'rxjs';
import { NotificationsService } from 'src/app/notifications/services/notifications.service';
import { ChangeTicketHolderRequest } from 'src/app/services/models/change-ticket-holder-request';
import { QrService } from '../../services/qr-service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css'],
  providers: [ OpenIdVerificationModalService ]
})
export class DetailComponent implements OnInit {

  tickets: Array<TicketPreviewModel> = [];

  closeResult: string;
  name = 'Angular 6';
  htmlContent = '';
  event: EventModel;
  idVerified: boolean = false;
  loader = false;
  loadingError = false;

  eventImageUrl = Environment.serviceUrl + '/events/image?eventId=';

  dateFormatter: DateFormatter = new DateFormatter();

  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    toolbarHiddenButtons: [
      ['bold']
      ],
    customClasses: [
      {
        name: "quote",
        class: "quote",
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: "titleText",
        class: "titleText",
        tag: "h1",
      },
    ]
  };

  selectedIndex = -1;
  editing = false;

  newFirstName = '';
  newLastName = '';
  focuses$ = [];
  selectedIdParam;
  eventHash;

  constructor(
    private modalService: NgbModal, 
    private activatedRoute: ActivatedRoute, 
    private ticketPersonalizationService: TicketPersonalizationService,
    private openIdVerificationModalService: OpenIdVerificationModalService,
    private notificationsService: NotificationsService,
    private router: Router,
    private qrService: QrService,
    private translate: TranslateService
  ) {
    
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(data => {
      this.eventHash = this.activatedRoute.snapshot.queryParamMap.get("event");
      if (!this.eventHash) {
        let uuid = this.activatedRoute.snapshot.queryParamMap.get("uuid");

        this.qrService.getUrlParams(uuid).subscribe(response => {
          this.eventHash = response.urlParams;
          this.event = JSON.parse(atob(this.eventHash));
          this.eventImageUrl += this.event.eventId;
          this.selectedIdParam = response.selectedId;

          this.getTickets();
        })
      } else {
        this.event = JSON.parse(atob(this.eventHash));
        this.eventImageUrl += this.event.eventId;
        this.getTickets();
      }
    });
  }

  open(content) {
    this.modalService.open(content, { size: 'lg' }).result.then(response => {

    }, error => {
      this.getTickets();
    });
  }

  openIdVerificationComponent() {
    this.openIdVerificationModalService.openModal();
  }

  getTickets() {
    this.loader = true;
    let request: GetNonPersonalizedTicketsByEventRequest = new GetNonPersonalizedTicketsByEventRequest();
    request.eventId = this.event.eventId;
    request.syncDate = this.event.syncDate;

    this.ticketPersonalizationService.getNonPersonalizedTicketsByEvent(request).subscribe(response => {
      console.log(response);
      this.idVerified = response.idVerified;
      this.tickets = [...response.tickets];
      for (let i = 0; i < this.tickets.length; i++) {
        this.tickets[i].prePersonalizedToUsername = '';
        this.tickets[i].usernamesAndEmails = [];
        this.tickets[i].userIds = [];

        for (let j = 0; j < response.tickets[i].possibleUsernamesAndEmails.length; j++) {
          this.tickets[i].usernamesAndEmails.push(response.tickets[i].possibleUsernamesAndEmails[j].usernameAndEmail);
          this.tickets[i].userIds.push(response.tickets[i].possibleUsernamesAndEmails[j].userId);
          if (this.tickets[i].usernameAndEmail) {
            this.tickets[i].prePersonalizedToUsername = this.tickets[i].usernameAndEmail;
          }
        }

        this.focuses$.push(new Subject<string>());

        this.tickets[i].search = (text$: Observable<string>) => {
          let inputFocus$ = this.focuses$[i];
          return merge(text$, inputFocus$).pipe(
              distinctUntilChanged(),
              map(term => this.tickets[i].usernamesAndEmails.filter(username => new RegExp(term.replace(/([!@#$%^&*()+=\[\]\\';,./{}|":<>?~_-])/g, "\\$1"), 'mi').test(username)))
            )
        }
      }

      this.loader = false;

      if (this.selectedIdParam) {
        this.openIdVerificationComponent();
        this.selectedIdParam = 0;
      }
    }, error => {
      console.log(error);
      this.loader = false;
      this.loadingError = true;
    });
  }

  assignTicket(i) {
    let request: AssignTicketRequest = new AssignTicketRequest();
    request.tickets = [];
    let t: TicketToAssign = new TicketToAssign();
    t.ticketId = this.tickets[i].id;
    let index = this.tickets[i].usernamesAndEmails.indexOf(this.tickets[i].prePersonalizedToUsername);
    if (index == -1) {
      this.translate.get('notifications.personalization.usernameNotValid').subscribe((data:any)=> {
        this.notificationsService.showError(data);
      }); 
      return;
    }
    this.loader = true;
    t.userId = this.tickets[i].userIds[index];
    request.tickets.push(t);

    this.ticketPersonalizationService.assignTicket(request).subscribe(response => {
      this.translate.get('notifications.personalization.ticketAssigned').subscribe((data:any)=> {
        this.notificationsService.showSuccess(data);
      });
      if(this.tickets.length !=1) {
        this.getTickets();
      } else {
        this.router.navigateByUrl('/personalization');
      }
      
    }, error => {
      console.log(error);
      this.loader = false;
    })
  }

  assignAllTickets() {
    let request: AssignTicketRequest = new AssignTicketRequest();
    request.tickets = [];

    for (let i = 0; i < this.tickets.length; i++) {
      let t: TicketToAssign = new TicketToAssign();
      t.ticketId = this.tickets[i].id;
      let index = this.tickets[i].usernamesAndEmails.indexOf(this.tickets[i].prePersonalizedToUsername);
      if (index != -1) {
        t.userId = this.tickets[i].userIds[index];
        request.tickets.push(t);
      }
    }

    if (request.tickets.length != 0) {
      this.loader = true;
      this.ticketPersonalizationService.assignTicket(request).subscribe(response => {
        this.getTickets();
        this.translate.get('notifications.personalization.ticketsAssigned').subscribe((data:any)=> {
          this.notificationsService.showSuccess(data);
        });
      }, error => {
        console.log(error);
        this.loader = false;
      })
    } else {
      this.translate.get('notifications.personalization.nothingToAssign').subscribe((data:any)=> {
        this.notificationsService.showError(data);
      });
    }
  }

  changeTicketHolder(i) {
    let request: ChangeTicketHolderRequest = new ChangeTicketHolderRequest();
    request.ticketId = this.tickets[i].id;
    request.firstname = this.newFirstName;
    request.lastname = this.newLastName;

    this.ticketPersonalizationService.changeTicketHolder(request).subscribe(respose => {
      this.cancelEditing();
      this.getTickets();
      this.translate.get('notifications.personalization.ticketHolderChanged').subscribe((data:any)=> {
        this.notificationsService.showSuccess(data);
      });
    });
  }

  startEditing(i) {
    this.selectedIndex = i;
    this.newFirstName = this.tickets[i].prePersonalizedToFirstName;
    this.newLastName = this.tickets[i].prePersonalizedToLastName;
    this.editing = true;
  }

  cancelEditing() {
    this.selectedIndex = -1;
    this.newFirstName = '';
    this.newLastName = '';
    this.editing = false;
  }
}

