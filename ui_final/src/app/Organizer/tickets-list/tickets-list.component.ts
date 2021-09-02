import { Component, OnInit } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { from } from 'rxjs';
import { DateFormatter } from 'src/app/shared/date-formatter';
import { SearchOrganizersTicketsRequest } from '../services/models/search-organizer-ticket-list-request'
import { OrganizerTicketsModel } from '../services/models/organizer-ticket-list-model'
import * as moment from 'moment-timezone';
import { OrganizerListService } from '../services/organizer-service';
import { IDateRangePickerOptions } from 'ngx-daterange';
import { saveAs } from "file-saver";


@Component({
  selector: 'app-tickets-list',
  templateUrl: './tickets-list.component.html',
  styleUrls: ['./tickets-list.component.css'],
  providers: [SearchOrganizersTicketsRequest]
})
export class TicketsListComponent implements OnInit {

  dropdownList = [];
  selectedItems = [];
  dropdownSettings: IDropdownSettings = {};
  model;
  bookingId;
  dateFormatter: DateFormatter = new DateFormatter();
  pages = [];
  totalRecords = 15;
  companyName;

  showLimits = [10, 25, 50];

  loader = false;

  tickets: Array<OrganizerTicketsModel> = [];

  dateOptions: IDateRangePickerOptions = {
    autoApply: true,
    //Change to be dynamic
     clickOutsideAllowed: false,
     format: "DD.MM.YYYY"
  }


  constructor(public request: SearchOrganizersTicketsRequest, private organizerService: OrganizerListService) { }

  ngOnInit(): void {

    this.dropdownList = [
      { item_id: 1, item_text: 'Personalized' },
      { item_id: 2, item_text: 'Personalization pending' },
      { item_id: 3, item_text: 'Personalization failed' },
      { item_id: 4, item_text: 'Checked-in' },
      { item_id: 5, item_text: 'Blocked for Pickup' },

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
    this.getOrganizerContext();
    this.request.limit = this.showLimits[0];
    this.searchTicketList();
  }

  unselectAll() {
    this.selectedItems = [];
    this.searchTicketList();
  }

  onSelectAll(items: any) {
    this.selectedItems = [];
    for (let i = 0; i < this.dropdownList.length; i++) {
      this.selectedItems.push(this.dropdownList[i]);
    }
    this.searchTicketList();
  }

  next() {
    if (this.request.page < this.pages.length) {
      this.request.page++;
      this.searchTicketList(true);
    }
  }

  previous() {
    if (this.request.page > 1) {
      this.request.page--;
      this.searchTicketList(true);
    }
  }

  getFromPage() {
    return (this.request.page - 1) * this.request.limit + 1;
  }

  getToPage() {
    return Math.min(this.request.page * this.request.limit, this.totalRecords);
  }

  onPageChange(page) {
    this.request.page = page;
    this.searchTicketList(true);
  }

  onLimitChange() {
    this.searchTicketList();
  }

  getFromToDate(range) {
    if (range) {
      this.request.fromDate = moment(range.split(" - ")[0], 'DD.MM.YYYY').tz("Europe/Vienna").format();
      this.request.toDate = moment(range.split(" - ")[1], 'DD.MM.YYYY').tz("Europe/Vienna").format();
      this.searchTicketList();
    } else {
      this.request.fromDate = null;
      this.request.toDate = null;
    }
  }

  resetDate() {
    this.request.fromDate = null;
    this.request.toDate = null;

  }

  searchTicketList(changePage = false) {
    if (!changePage) {
      this.request.page = 1;
    }
    this.request.status = []
    for (let i = 0; i < this.selectedItems.length; i++) {
      this.request.status.push(this.selectedItems[i].item_id);
    }

    this.loader = true;
 
    this.organizerService.searchOrganizerTickets(this.request).subscribe(response => {
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
    this.organizerService.exportExcel(this.request).subscribe(response => {
      saveAs(response, 'tickets');
    }, error => {
      console.log(error);
    });
  }

  exportCsv() {
    this.organizerService.exportCsv(this.request).subscribe(response => {
      saveAs(response, 'tickets.csv');
    }, error => {
      console.log(error);
    });
  }

  exportPdf() {
    this.organizerService.exportPdf(this.request).subscribe(response => {
      saveAs(response, 'tickets');
    }, error => {
      console.log(error);
    });
  }

  getOrganizerContext(){
    this.organizerService.getOrganizerContext().subscribe(response => {
     console.log(response)
     this.companyName = response.companyName
    }, error => {
      console.log(error);
    });
  }

}


