import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { TicketPreviewModel } from '../../tickets/models/ticket-preview-model';
import { IDateRangePickerOptions } from 'ngx-daterange'
import { GetMarketplaceMySalesRequest } from 'src/app/services/models/get-marketplace-mysales-request';
import { MarketplaceService } from '../../services/marketplace-service';
import * as moment from 'moment-timezone';
import { Environment } from 'src/app/environments/environment';
import { DateFormatter } from 'src/app/shared/date-formatter';
import { TranslateService } from '@ngx-translate/core';
import { LocalisationService } from 'src/app/localisation/services/localisation.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-my-tickets',
  templateUrl: './my-tickets.component.html',
  styleUrls: ['./my-tickets.component.css']
})
export class MyTicketsComponent implements OnInit, OnDestroy {

  public isTreeCollapsed = true;
  public show = 1;

  public buttonName: any = 'Next';
  page = 1;
  categories = [];
  dateChanged = 10;
  tickets: Array<TicketPreviewModel> = [];
  selectedCategories = [];
  dropdownSettings: IDropdownSettings = {};
  pages: Array<number> = [];
  eventName = "";
  dateRange;
  fromDate;
  toDate;
  selectedTicketId;
  ticketPrice;
  closeResult: string;

  filterTranslationKeys = [
    'ticketFilters.concerts',
    'ticketFilters.culture',
    'ticketFilters.sports',
    'ticketFilters.musicalAndShow',
    'ticketFilters.cabaretAndComedy'
  ]

  eventImageUrl = Environment.serviceUrl + '/events/image?eventId=';

  loader = false;

  dateFormatter: DateFormatter = new DateFormatter();

  dateOptions: IDateRangePickerOptions = {
    autoApply: true,
    //Change to be dynamic
    clickOutsideAllowed: false,
    format: "DD.MM.YYYY"  }

  getFromToDate(range) {
    if (range) {
      this.fromDate = moment(range.split(" - ")[0], "DDMMYYYY").tz("Europe/Vienna").format();
      this.toDate = moment(range.split(" - ")[1], "DDMMYYYY").tz("Europe/Vienna").format();
      this.getMySalesTickets();
    } else {
      this.fromDate = null;
      this.toDate = null;
    }
  }

  changeLanguageSubscription: Subscription;

  constructor(private marketplaceService: MarketplaceService, private translate: TranslateService, private localisationService: LocalisationService) { }

  ngOnInit(): void {

    this.setLanguage();
    this.changeLanguageSubscription = this.localisationService.changeLanguage$.subscribe(() => {
        this.setLanguage();
    })
    

    this.getMySalesTickets();
  }

  ngOnDestroy() {
    this.changeLanguageSubscription.unsubscribe();
  }

  setLanguage() {
    this.categories = [
      { item_id: 1, item_text: 'Concerts' },
      { item_id: 2, item_text: 'Culture' },
      { item_id: 3, item_text: 'Sports' },
      { item_id: 4, item_text: 'Musical & Show' },
      { item_id: 5, item_text: 'Cabaret & Comedy' }
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

    this.selectedCategories = [...this.selectedCategories];

    for (let i = 0; i < this.filterTranslationKeys.length; i++) {
      this.translate.get(this.filterTranslationKeys[i]).subscribe((data:any)=> {
        this.categories[i].item_text = data;
        for (let j = 0; j < this.selectedCategories.length; j++) {
          if (this.selectedCategories[j].item_id == i+1) {
            this.selectedCategories[j].item_text = data;
            break;
          }  
        }
      });
    }

    this.translate.get('ticketFilters.selectAll').subscribe((data:any)=> {
      this.dropdownSettings.selectAllText = data;
    });

    this.translate.get('ticketFilters.unselectAll').subscribe((data:any)=> {
      this.dropdownSettings.unSelectAllText = data;
    });

    this.translate.get('ticketFilters.search').subscribe((data:any)=> {
      this.dropdownSettings.searchPlaceholderText = data;
    });
  }

  selectAllCategories() {
    this.selectedCategories = [];
    for (let i = 0; i < this.categories.length; i++) {
      this.selectedCategories.push(this.categories[i]);
      console.log(this.selectedCategories)
    }
    this.getMySalesTickets();
  }


  unselectAllCategories() {
    this.selectedCategories = [];
    this.getMySalesTickets();
  }


  getMySalesTickets() {
    this.loader = true;
    let request = new GetMarketplaceMySalesRequest();
    request.eventName = this.eventName;
    request.categories = [];
    request.fromDate = this.fromDate;
    request.toDate = this.toDate;
    request.page = this.page;
    for (let i = 0; i < this.selectedCategories.length; i++) {
      request.categories.push(this.selectedCategories[i].item_id.toString());
    }
    this.marketplaceService.getMySalesMarketplace(request).subscribe(response => {
      console.log(response);
      this.tickets = response.tickets;
      this.pages = [];
      for (let i = 0; i < response.totalPages; i++) {
        this.pages.push(i + 1);
      }
      this.loader = false;
    }, error => {
      console.log(error);
      this.loader = false;
    });
  }
}

