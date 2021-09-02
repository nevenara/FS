import { Component, OnInit } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { SearchTicketsRequest } from '../../services/models/search-tickets-request';
import { TicketService } from '../../services/ticket-service';
import { TicketPreview } from '../../models/ticket-preview';
import { saveAs } from "file-saver";
import { DateFormatter } from '../../../shared/date-formatter';
import * as moment from 'moment-timezone';
import { IDateRangePickerOptions } from 'ngx-daterange';
import { UserType } from 'src/app/services/models/user-context';
import { AuthenticationService } from 'src/app/services/authentication-service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  dropdownList = [];
  selectedItems = [];
  dropdownSettings :IDropdownSettings = {};

  searchTicketsRequest: SearchTicketsRequest = new SearchTicketsRequest();
  tickets: Array<TicketPreview> = [];

  dateFormatter: DateFormatter = new DateFormatter();

  pages = [];
  totalRecords = 15;

  showLimits = [10, 25, 50];

  loader = false;

  dateOptions :IDateRangePickerOptions = {
    autoApply: true,
    //Change to be dynamic
     minDate: moment("2020-01-01T00:00:00+02:00"),
     maxDate: moment("2022-01-01T00:00:00+02:00"),
     clickOutsideAllowed: false,
     format: "DD.MM.YYYY"
  }

  userType: UserType;

  constructor(
    private ticketService: TicketService,
    private authService: AuthenticationService
  ) { }

  ngOnInit(): void {
    this.dropdownList = [
      { item_id: 1, item_text: 'Personalized' },
      { item_id: 2, item_text: 'Personalization pending' },
      { item_id: 3, item_text: 'Personalization failed' },
      { item_id: 4, item_text: 'Checked-in' },
      { item_id: 5, item_text: 'Blocked for Pickup' }
    ];
    this.selectedItems = [];
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 1,
      allowSearchFilter: true
    };

    this.searchTicketsRequest.limit = this.showLimits[0];
    this.searchTickets();
    this.getUserType();
  }

  getUserType() {
    this.authService.getUserType().subscribe(response => {
      this.userType = response.userType;
    })
  }

  unselectAll() {
    this.selectedItems = [];
    this.searchTickets();
  }
  
  onSelectAll(items: any) {
    this.selectedItems = [];
    for (let i = 0; i < this.dropdownList.length; i++) {
      this.selectedItems.push(this.dropdownList[i]);
    }
    this.searchTickets();
  }

  next() {
    if (this.searchTicketsRequest.page < this.pages.length) {
      this.searchTicketsRequest.page++;
      this.searchTickets(true);
    }
  }

  previous() {
    if (this.searchTicketsRequest.page > 1) {
      this.searchTicketsRequest.page--;
      this.searchTickets(true);
    }
  }

  getFromPage() {
    return (this.searchTicketsRequest.page - 1) * this.searchTicketsRequest.limit + 1;
  }

  getToPage() {
    return Math.min(this.searchTicketsRequest.page * this.searchTicketsRequest.limit, this.totalRecords);
  }

  onPageChange(page) {
    console.log(page);
    this.searchTicketsRequest.page = page;
    this.searchTickets(true);
  }

  onLimitChange() {
    this.searchTickets();
  }

  getFromToDate(range){
    if (range) {
      this.searchTicketsRequest.fromDate = moment(range.split(" - ")[0], 'DD.MM.YYYY').tz("Europe/Vienna").format();
      this.searchTicketsRequest.toDate = moment(range.split(" - ")[1], 'DD.MM.YYYY').tz("Europe/Vienna").format();
      this.searchTickets();
    } else {
      this.searchTicketsRequest.fromDate = null;
      this.searchTicketsRequest.toDate = null;
    }
  }

  resetDate(){
    this.searchTicketsRequest.fromDate = null;
    this.searchTicketsRequest.toDate = null;

  }

  searchTickets(changePage = false) {
    if (!changePage) {
      this.searchTicketsRequest.page = 1;
    }
    
    this.loader = true;

    this.searchTicketsRequest.status = [];
    for (let i = 0; i < this.selectedItems.length; i++) {
      this.searchTicketsRequest.status.push(this.selectedItems[i].item_id);
    }
    
    this.ticketService.searchTickets(this.searchTicketsRequest).subscribe(response => {
      console.log(response);
      this.tickets = response.tickets;
      this.totalRecords = response.totalRecords;
      this.pages = [];
      for (let i = 0; i < response.totalPages; i++) {
        this.pages.push(i + 1);
      }
      this.loader = false;
    }, error => {
      console.log(error);
      this.loader = false;
    })
  }

  exportExcel() {
    this.ticketService.exportExcel(this.searchTicketsRequest).subscribe(response => {
      saveAs(response, 'tickets');
    }, error => {
      console.log(error);
    });
  }

  exportCsv() {
    this.ticketService.exportCsv(this.searchTicketsRequest).subscribe(response => {
      saveAs(response, 'tickets.csv');
    }, error => {
      console.log(error);
    });
  }

  exportPdf() {
    this.ticketService.exportPdf(this.searchTicketsRequest).subscribe(response => {
      saveAs(response, 'tickets');
    }, error => {
      console.log(error);
    });
  }

}


