import { Component, OnInit } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { IDateRangePickerOptions } from 'ngx-daterange'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GetMarketplaceRequest } from 'src/app/services/models/get-marketplace-request';
import { MarketplaceService } from '../../services/marketplace-service';
import { TicketPreviewModel } from '../../tickets/models/ticket-preview-model';
import * as moment from 'moment';

@Component({
  selector: 'app-market-tickets',
  templateUrl: './market-tickets.component.html',
  styleUrls: ['./market-tickets.component.css']
})
export class MarketTicketsComponent implements OnInit {
  isTreeCollapsed = true;
  selectedTicketId: string;
  show = 1;

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
  

  dateOptions: IDateRangePickerOptions = {
    autoApply: true,
    //Change to be dynamic
    minDate: moment("2013-06-30T00:00:00+02:00"),
    maxDate: moment("2022-10-30T00:00:00+02:00"),
    format: "YYYY-MM-DD"
  }

  increasePrice(priceType) {
    if (this.toPrice > this.fromPrice) {
      if (priceType == "from") {
        this.fromPrice++;
      }
      if (priceType == "to") {
        this.toPrice++;
      }
      this.getMarketplaceTickets();
    }
    else {
      return
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
      if (this.fromPrice < 0) {
        this.fromPrice = 0
      }
      if (this.toPrice < 0) {
        this.toPrice = 0
      }
      this.getMarketplaceTickets();
    }
    else {
      return;
    }
  }

  validatePriceInput(price) {
    if (this.toPrice < price) {
      return true
    }
  }

  getFromToDate(range) {
    this.fromDate = moment(range.split(" - ")[0]).utcOffset(2).format();
    this.toDate = moment(range.split(" - ")[1]).utcOffset(2).format();
  }

  constructor(private modalService: NgbModal, private marketplaceService: MarketplaceService) { }

  openBuyTicketComponent(content, ticketId) {
    this.show = 1;
    this.selectedTicketId = ticketId;
    this.modalService.open(content, { size: 'xl' }).result.then((result) => {  
    }, (reason) => {
      this.cancelReservation();
    });;
  }

  ngOnInit(): void {
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
      allowSearchFilter: true
    };

    this.locations = [
      { item_id: 1, item_text: 'Pakistan' },
      { item_id: 2, item_text: 'Saudi Arabia' },
      { item_id: 3, item_text: 'China' },
      { item_id: 4, item_text: 'Iran' },
      { item_id: 5, item_text: 'Berlin' }

    ];

    this.dropdownSettings1 = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 2,
      allowSearchFilter: true
    };

    this.getMarketplaceTickets();
  }

  onPageChange(page) {
    this.page = page;
  }

  selectAllCategories() {
    this.selectedCategories = [];
    for (let i = 0; i < this.dropdownList.length; i++) {
      this.selectedCategories.push(this.dropdownList[i]);
      console.log(this.selectedCategories)
    }
    this.getMarketplaceTickets();
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

  cancelReservation() {
    console.log('cancel');
  }
            
  getMarketplaceTickets() {
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
      request.locations.push(this.selectedLocation[i].item_text);
    }
    this.marketplaceService.getMarketplace(request).subscribe(response => {
      console.log(response);
      this.tickets = response.tickets;
      for (let i = 0; i < this.tickets.length; i++) {
        for (let j = 0; j < this.tickets[i].placeholders.length; j++) {
          this.tickets[i].placeholders[j].image = "data:" + this.tickets[i].placeholders[j].mimetype +";base64," + this.tickets[i].placeholders[j].image;
        }
      }
      this.pages = [];
      for (let i = 0; i < response.totalPages; i++) {
        this.pages.push(i + 1);
      }
    }, error => {
      console.log(error);
    });
  }
}

