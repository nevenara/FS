import { Component, OnDestroy, OnInit } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { MyTicketsService } from '../../services/my-tickets-service';
import { GetUpcomingEventsRequest } from 'src/app/services/models/get-upcoming-events-request';
import { TicketPreviewModel } from '../models/ticket-preview-model';
import { IDateRangePickerOptions } from 'ngx-daterange'
import * as moment from 'moment-timezone';
import { Environment } from 'src/app/environments/environment';
import { DateFormatter } from 'src/app/shared/date-formatter';
import { UserProfileService } from 'src/app/services/user-profile-service';
import { Router } from '@angular/router';
import { UpdateBankAccountModalService } from 'src/app/account/update-bank-account/services/update-bank-account-modal-service';
import { TranslateService } from '@ngx-translate/core';
import { LocalisationService } from 'src/app/localisation/services/localisation.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-upcoming',
  templateUrl: './upcoming.component.html',
  styleUrls: ['./upcoming.component.css'],
  providers: [UpdateBankAccountModalService]
})
export class UpcomingComponent implements OnInit, OnDestroy {

  isTreeCollapsed = true;
  page = 1;
  dropdownList = [];
  selectedCategories = [];
  dropdownSettings :IDropdownSettings = {};
  dropdownList1 = [];
  selectedAdditionalFilter = [];
  dropdownSettings1 :IDropdownSettings = {};
  tickets: Array<TicketPreviewModel> = [];
  showLinkedAccountsFilter: boolean = false;
  showTicketsOnSaleFilter: boolean = true;
  showTicketsWithRepersonalizationInProgress: boolean = true;
  dateRange;
  pages: Array<number> = [];
  fromDate;
  toDate;
  selectedId: string;

  eventImageUrl = Environment.serviceUrl + '/events/image?eventId=';

  loader = false;

  dateFormatter: DateFormatter = new DateFormatter();

  dateOptions :IDateRangePickerOptions = {
    autoApply: true,
    //Change to be dynamic
     minDate: moment(),
     clickOutsideAllowed: false,
     format: "DD.MM.YYYY"
  }

  filterTranslationKeys = [
    'ticketFilters.concerts',
    'ticketFilters.culture',
    'ticketFilters.sports',
    'ticketFilters.musicalAndShow',
    'ticketFilters.cabaretAndComedy'
  ]

  filter1TranslationKeys = [
    'ticketFilters.linkedAccounts',
    'ticketFilters.onSale',
    'ticketFilters.repersonalization',
    'ticketFilters.waitingForPayment'
  ]

  changeLanguageSubscription: Subscription;

  getFromToDate(range){
    if (range) {
      this.fromDate = moment(range.split(" - ")[0], "DDMMYYYY").tz("Europe/Vienna").format();
      this.toDate = moment(range.split(" - ")[1], "DDMMYYYY").tz("Europe/Vienna").format();
      this.getUpcomingTickets();
    } else {
      this.fromDate = null;
      this.toDate = null;
    }
  }

  constructor(
    private myTicketsService: MyTicketsService,
    private userProfileService: UserProfileService,
    private router: Router,
    private updateBankAccountModalService: UpdateBankAccountModalService,
    private translate: TranslateService,
    private localisationService: LocalisationService
  ) { }


  ngOnInit(): void {
    
    this.setLanguage();
    this.changeLanguageSubscription = this.localisationService.changeLanguage$.subscribe(() => {
        this.setLanguage();
    })

    this.getUpcomingTickets();
  }

  ngOnDestroy() {
    this.changeLanguageSubscription.unsubscribe();
  }

  setLanguage() {
    this.dropdownList = [
      { item_id: 1, item_text: 'Concerts' },
      { item_id: 2, item_text: 'Culture' },
      { item_id: 3, item_text: 'Sports' },
      { item_id: 4, item_text: 'Musical & Show' },
      { item_id: 5, item_text: 'Cabaret & Comedy' }
    ];

    this.dropdownList1 = [
      { item_id: 1, item_text: 'Show Linked Account Tickets' },
      { item_id: 2, item_text: 'Show Tickets on sale' },
      { item_id: 3, item_text: 'Show Tickets with "Re-Pers. waiting"' },
      { item_id: 4, item_text: 'Show Tickets with "Waiting for payment"' }
    ];

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 2,
      allowSearchFilter: true,
      searchPlaceholderText: "Search"
    };

    this.dropdownSettings1 = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 2,
      allowSearchFilter: true,
      searchPlaceholderText: "Search"
    };

    this.selectedCategories = [...this.selectedCategories];
    this.selectedAdditionalFilter = [...this.selectedAdditionalFilter];

    for (let i = 0; i < this.filterTranslationKeys.length; i++) {
      this.translate.get(this.filterTranslationKeys[i]).subscribe((data:any)=> {
        this.dropdownList[i].item_text = data;
        for (let j = 0; j < this.selectedCategories.length; j++) {
          if (this.selectedCategories[j].item_id == i+1) {
            this.selectedCategories[j].item_text = data;
            break;
          }  
        }
      });
    }

    for (let i = 0; i < this.filter1TranslationKeys.length; i++) {
      this.translate.get(this.filter1TranslationKeys[i]).subscribe((data:any)=> {
        this.dropdownList1[i].item_text = data;
        for (let j = 0; j < this.selectedAdditionalFilter.length; j++) {
          if (this.selectedAdditionalFilter[j].item_id == i+1) {
            this.selectedAdditionalFilter[j].item_text = data;
            break;
          }  
        }
      });
    }

    this.translate.get('ticketFilters.selectAll').subscribe((data:any)=> {
      this.dropdownSettings.selectAllText = data;
      this.dropdownSettings1.selectAllText = data;
    });

    this.translate.get('ticketFilters.unselectAll').subscribe((data:any)=> {
      this.dropdownSettings.unSelectAllText = data;
      this.dropdownSettings1.unSelectAllText = data;
    });

    this.translate.get('ticketFilters.search').subscribe((data:any)=> {
      this.dropdownSettings.searchPlaceholderText = data;
      this.dropdownSettings1.searchPlaceholderText = data;
    });
  }

  onPageChange(page) {
    this.page = page;
    this.getUpcomingTickets();
  }

  onDateRangeSelected() {
    console.log(this.dateRange);
  }

  selectAllCategories() {
    this.selectedCategories = [];
    for (let i = 0; i < this.dropdownList.length; i++) {
      this.selectedCategories.push(this.dropdownList[i]);
      console.log(this.selectedCategories)
    }
    this.getUpcomingTickets();
  }

  selectAllAdditionalFilters() {
    this.selectedAdditionalFilter = [];
    for (let i = 0; i < this.dropdownList1.length; i++) {
      this.selectedAdditionalFilter.push(this.dropdownList1[i]);
      console.log(this.selectedAdditionalFilter)
    }
    this.getUpcomingTickets();
  }

  unselectAllCategories() {
    this.selectedCategories = [];
    this.getUpcomingTickets();
  }

  unselectAllAdditionalFilters() {
    this.selectedAdditionalFilter = [];
    this.getUpcomingTickets();
  }

  getUpcomingTickets() {
    this.loader = true;

    let request = new GetUpcomingEventsRequest();
    request.showLinkedAccountsFilter = this.selectedAdditionalFilter.find(additionalFilter => {return additionalFilter.item_id == 1}) ? true : false;
    request.showTicketsOnSaleFilter = this.selectedAdditionalFilter.find(additionalFilter => {return additionalFilter.item_id == 2}) ? true : false;
    request.showTicketsWithRepersonalizationInProgress = this.selectedAdditionalFilter.find(additionalFilter => {return additionalFilter.item_id == 3}) ? true : false;
    request.showWaitingForPayment = this.selectedAdditionalFilter.find(additionalFilter => {return additionalFilter.item_id == 4}) ? true : false;
    request.fromDate = this.fromDate;
    request.toDate = this.toDate;
    request.categories = [];
    for (let i = 0; i < this.selectedCategories.length; i++) {
      request.categories.push(this.selectedCategories[i].item_id.toString());
    }

    request.page = this.page;
    
    this.myTicketsService.getUpcomingEvents(request).subscribe(response => {
      console.log(response);
      this.tickets = response.tickets;

      this.pages = [];
      for (let i = 0; i < response.totalPages; i++) {
          this.pages.push(i+1);
      }

      this.loader = false;
    }, error => {
      console.log(error);
      this.loader = false;
    });
  }

  sellTicket(ticketId) {
    this.userProfileService.getBankAccountDetails().subscribe(res => {
        if (res.stripeAccountStatus && res.stripeAccountStatus == 'verified') {
            this.router.navigateByUrl('/tickets/sellticket/' + ticketId);
        } else {
          this.selectedId = ticketId;
          this.updateBankAccountModalService.openModal();
        }
    }, error => {
    });
  }

  navigateToSell(success) {
    if (success) {
      this.router.navigateByUrl('/tickets/sellticket/' + this.selectedId);
    }
  }
}
