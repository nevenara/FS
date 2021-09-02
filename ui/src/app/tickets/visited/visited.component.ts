import { Component, OnInit } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { MyTicketsService } from '../../services/my-tickets-service';
import { GetVisitedEventsRequest } from 'src/app/services/models/get-visited-events-request';
import { TicketPreviewModel } from '../models/ticket-preview-model';
import { IDateRangePickerOptions } from 'ngx-daterange' 
import * as moment from 'moment';


@Component({
  selector: 'app-visited',
  templateUrl: './visited.component.html',
  styleUrls: ['./visited.component.css']
})
export class VisitedComponent implements OnInit {
  constructor(private myTicketsService: MyTicketsService) { }
  page = 1;
  dropdownList = [];
  selectedCategories = [];
  dropdownSettings: IDropdownSettings = {};
  dropdownList1 = [];
  selectedAdditionalFilter = [];
  dropdownSettings1: IDropdownSettings = {};
  public isTreeCollapsed = true;
  tickets: Array<TicketPreviewModel> = [];
  showLinkedAccountsFilter: boolean = false;
  showTicketsOnSaleFilter: boolean = true;
  showTicketsWithRepersonalizationInProgress: boolean = true;
  pages: Array<number> = [];
  fromDate;
  toDate;

  dateOptions :IDateRangePickerOptions = {
    autoApply: true,
    //Change to be dynamic
     minDate: moment("2013-06-30T00:00:00+02:00"),
     maxDate: moment(),
     format: "YYYY-MM-DD"
  }

  getFromToDate(range){
    this.fromDate = moment(range.split(" - ")[0]).utcOffset(2).format();
    this.toDate = moment(range.split(" - ")[1]).utcOffset(2).format();
    }


  ngOnInit() {
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

    this.dropdownList1 = [
      { item_id: 1, item_text: 'Show only Linked Account Tickets' },
    ];

    this.dropdownSettings1 = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 1,
      allowSearchFilter: true
    };

     this.getVisitedTickets();
      
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
    this.getVisitedTickets();
  }

  selectAllAdditionalFilters() {
    this.selectedAdditionalFilter = [];
    for (let i = 0; i < this.dropdownList1.length; i++) {
      this.selectedAdditionalFilter.push(this.dropdownList1[i]);
      console.log(this.selectedAdditionalFilter)
    }
    this.getVisitedTickets();
  }

  unselectAllCategories() {
    this.selectedCategories = [];
    this.getVisitedTickets();
  }

  unselectAllAdditionalFilters() {
    this.selectedAdditionalFilter = [];
    this.getVisitedTickets();
  }

  getVisitedTickets() {
    let request = new GetVisitedEventsRequest();
    request.showLinkedAccountsFilter = this.selectedAdditionalFilter.find(additionalFilter => {return additionalFilter.item_id == 1}) ? true : false;
    request.showTicketsOnSaleFilter = this.selectedAdditionalFilter.find(additionalFilter => {return additionalFilter.item_id == 2}) ? true : false;
    request.showTicketsWithRepersonalizationInProgress = this.selectedAdditionalFilter.find(additionalFilter => {return additionalFilter.item_id == 3}) ? true : false;
    request.fromDate = this.fromDate;
    request.toDate = this.toDate;
    request.page = this.page;
    request.categories = [];
    for (let i = 0; i < this.selectedCategories.length; i++) {
      request.categories.push(this.selectedCategories[i].item_id.toString());
    }
    for (let i = 0; i < this.selectedAdditionalFilter.length; i++) {
      request.categories.push(this.selectedAdditionalFilter[i].item_id.toString());
    }
    this.myTicketsService.getVisitedEvents(request).subscribe(response => {
      console.log(response);
      this.tickets = response.tickets;
      for (let i = 0; i < this.tickets.length; i++) {
        for (let j = 0; j < this.tickets[i].placeholders.length; j++) {
          this.tickets[i].placeholders[j].image = "data:" + this.tickets[i].placeholders[j].mimetype +";base64," + this.tickets[i].placeholders[j].image;
        }
      }
      this.pages = [];
      for (let i = 0; i < response.totalPages; i++) {
          this.pages.push(i+1);
      }
    }, error => {
      console.log(error);
    });
  }
}
