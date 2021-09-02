import { Component, OnDestroy, OnInit } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { IDateRangePickerOptions } from 'ngx-daterange'
import { GetMarketplaceRequest } from 'src/app/services/models/get-marketplace-request';
import { MarketplaceService } from '../../services/marketplace-service';
import { TicketPreviewModel } from '../../tickets/models/ticket-preview-model';
import * as moment from 'moment-timezone';
import { Environment } from 'src/app/environments/environment';
import { DateFormatter } from 'src/app/shared/date-formatter';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { LocalisationService } from '../../localisation/services/localisation.service';

@Component({
  selector: 'app-market-tickets',
  templateUrl: './market-tickets.component.html',
  styleUrls: ['./market-tickets.component.css']
})

export class MarketTicketsComponent implements OnInit, OnDestroy {
  isTreeCollapsed = true;

  page = 1;
  dropdownList = [];
  tickets: Array<TicketPreviewModel> = [];
  selectedCategories = [];
  dropdownSettings: IDropdownSettings = {};
  selectedLocation = [];
  locations = [];
  eventName = "";
  dropdownSettings1: IDropdownSettings = {};
  showLinkedAccountsFilter: boolean = false;
  pages: Array<number> = [];
  fromPrice = 1;
  toPrice = 100;
  fromDate;
  toDate;
  loader = false;

  filterTranslationKeys = [
    'ticketFilters.concerts',
    'ticketFilters.culture',
    'ticketFilters.sports',
    'ticketFilters.musicalAndShow',
    'ticketFilters.cabaretAndComedy'
  ]

  dateFormatter: DateFormatter = new DateFormatter();
  
  eventImageUrl = Environment.serviceUrl + '/events/image?eventId=';

  dateOptions: IDateRangePickerOptions = {
    autoApply: true,
    //Change to be dynamic
    clickOutsideAllowed: false,
    format: "DD.MM.YYYY"
  }

  increasePrice(priceType) {
    if (this.fromPrice <= 0) {
      this.fromPrice = 0
    }
    if (this.toPrice <= 0) {
      this.toPrice = 0
    }
    if (this.toPrice > this.fromPrice) {
      if (priceType == "from") {
        this.fromPrice++;
      }
      if (priceType == "to") {
        this.toPrice++;
      }
      this.getMarketplaceTickets();
    }
    else if (this.toPrice == this.fromPrice){
      if (priceType == "to") {
        this.toPrice++;
        this.getMarketplaceTickets();
      }
    }
    else {
      this.toPrice =this.fromPrice
      return;
    }
  }
  decreasePrice(priceType) {
    
    if (this.toPrice > this.fromPrice) {
      if (priceType == "from") {
        this.fromPrice--;
      }
      if (priceType == "to") {
        this.toPrice--;
      }
      if (this.fromPrice <= 0) {
        this.fromPrice = 0
      }
      if (this.toPrice <= 0) {
        this.toPrice = 0
      }
      this.getMarketplaceTickets();
    }
    else if (this.toPrice == this.fromPrice){
     
      if (priceType == "from") {
        
        this.fromPrice--;
        this.getMarketplaceTickets();
      }
      if (this.fromPrice <= 0) {
        this.fromPrice = 0
      }
      if (this.toPrice <= 0) {
        this.toPrice = 0
      }
    }
    else {
      this.toPrice =this.fromPrice
      return;
    }
  }

  validatePriceInput(price) {
    if (this.toPrice < price) {
      return true
    }
  }

  getFromToDate(range) {
    if (range) {
      this.fromDate = moment(range.split(" - ")[0], "DDMMYYYY").tz("Europe/Vienna").format();
      this.toDate = moment(range.split(" - ")[1], "DDMMYYYY").tz("Europe/Vienna").format();
      this.getMarketplaceTickets();
    } else {
      this.fromDate = null;
      this.toDate = null;
    }
  }

  changeLanguageSubscription: Subscription;

  constructor(
    private marketplaceService: MarketplaceService,
    private translate: TranslateService,
    private localisationService: LocalisationService
  ) { }

  ngOnInit(): void {
    this.locations = [];

    this.setLanguage();
    this.changeLanguageSubscription = this.localisationService.changeLanguage$.subscribe(() => {
        this.setLanguage();
    })

    this.getMarketplaceLocations();
    this.getMarketplaceTickets();
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
    this.getMarketplaceTickets();
  }

  selectAllCategories() {
    this.selectedCategories = [];
    for (let i = 0; i < this.dropdownList.length; i++) {
      this.selectedCategories.push(this.dropdownList[i]);
      console.log(this.selectedCategories)
    }
    this.getMarketplaceTickets();
  }

  getMarketplaceLocations() {
    this.locations = []
    this.marketplaceService.getLocations().subscribe(response => {
      console.log(response)
     this.locations = response.locations
    }, error => {
      console.log(error);
    });
  }

  selectAllLocations() {
    this.selectedLocation = [];
    for (let i = 0; i < this.locations.length; i++) {
      this.selectedLocation.push(this.locations[i]);
      console.log(this.selectedLocation)
    }
    this.getMarketplaceTickets();
  }

  unselectAllCategories() {
    this.selectedCategories = [];
    this.getMarketplaceTickets();
  }

  unselectAllLocations() {
    this.selectedLocation = [];
    this.getMarketplaceTickets();
  }

  
            
  getMarketplaceTickets() {
    this.loader = true;
    let request = new GetMarketplaceRequest();
    request.eventName = this.eventName;
    request.categories = [];
    request.fromDate = this.fromDate;
    request.toDate = this.toDate;
    request.page = this.page;
    request.fromPrice = this.fromPrice;
    request.toPrice = this.toPrice;
    request.locations = [];
    for (let i = 0; i < this.selectedCategories.length; i++) {
      request.categories.push(this.selectedCategories[i].item_id.toString());
    }
    for (let i = 0; i < this.selectedLocation.length; i++) {
      request.locations.push(this.selectedLocation[i]);
    }
    this.marketplaceService.getMarketplace(request).subscribe(response => {
      this.loader=false;
      console.log(response);
      this.tickets = response.tickets;
      this.pages = [];
      for (let i = 0; i < response.totalPages; i++) {
        this.pages.push(i + 1);
      }
    }, error => {
      this.loader=false;
      console.log(error);
    });
  }
}

