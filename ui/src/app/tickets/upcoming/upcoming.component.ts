import { Component, OnInit } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { MyTicketsService } from '../../services/my-tickets-service';
import { GetUpcomingEventsRequest } from 'src/app/services/models/get-upcoming-events-request';
import { TicketPreviewModel } from '../models/ticket-preview-model';
import { IDateRangePickerOptions } from 'ngx-daterange' 
import * as moment from 'moment';


@Component({
  selector: 'app-upcoming',
  templateUrl: './upcoming.component.html',
  styleUrls: ['./upcoming.component.css']
})
export class UpcomingComponent implements OnInit {


  getDismissReason(reason: any) {
    throw new Error("Method not implemented.");
  }

  public isTreeCollapsed = true;
  public show:boolean = false;
  public hide:boolean = true;
  public buttonName:any = 'Next';


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
  closeResult = '';


reason = [
    {id: 1, name: '1'}, {id: 2, name: '2'}, {id: 3, name: '3'}
  ];

  dateOptions :IDateRangePickerOptions = {
    autoApply: true,
    //Change to be dynamic
     minDate: moment(),
     maxDate: moment("2022-10-30T00:00:00+02:00"),
     format: "YYYY-MM-DD"
  }

  getFromToDate(range){
    this.fromDate = moment(range.split(" - ")[0]).utcOffset(2).format();
    this.toDate = moment(range.split(" - ")[1]).utcOffset(2).format();
    }


  constructor(private modalService: NgbModal, private myTicketsService: MyTicketsService) { 

  }
    open(content) {
      this.modalService.open(content, { size: 'xl' }).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }
    open1(content1) {
      this.modalService.open(content1, { size: 'xl' }).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }
    open2(content2) {
      this.modalService.open(content2, { size: 'xl' }).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }



  ngOnInit(): void {
    
    this.dropdownList = [
      { item_id: 1, item_text: 'Concerts' },
      { item_id: 2, item_text: 'Culture' },
      { item_id: 3, item_text: 'Sports' },
      { item_id: 4, item_text: 'Musical & Show' },
      { item_id: 5, item_text: 'Cabaret & Comedy' }

    ]; //TODO from db
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
      { item_id: 2, item_text: 'Show only Tickets on sale' },
      { item_id: 3, item_text: 'Show only Tickets with "Re-Pers. waiting"' },
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

    this.getUpcomingTickets();
  }

  toggle() {
    this.show = !this.show;
    this.hide = !this.hide;
    // CHANGE THE NAME OF THE BUTTON.
    if(this.show)
      this.buttonName = "Pay Now";
    else
      this.buttonName = "Next";
  }

  toggle1() {
    this.show = !this.show;
    this.hide = !this.hide;

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
    let request = new GetUpcomingEventsRequest();
    request.showLinkedAccountsFilter = this.selectedAdditionalFilter.find(additionalFilter => {return additionalFilter.item_id == 1}) ? true : false;
    request.showTicketsOnSaleFilter = this.selectedAdditionalFilter.find(additionalFilter => {return additionalFilter.item_id == 2}) ? true : false;
    request.showTicketsWithRepersonalizationInProgress = this.selectedAdditionalFilter.find(additionalFilter => {return additionalFilter.item_id == 3}) ? true : false;
    request.fromDate = this.fromDate;
    request.toDate = this.toDate;
    request.categories = [];
    for (let i = 0; i < this.selectedCategories.length; i++) {
      request.categories.push(this.selectedCategories[i].item_id.toString());
    }
    for (let i = 0; i < this.selectedAdditionalFilter.length; i++) {
      request.categories.push(this.selectedAdditionalFilter[i].item_id.toString());
    }

    request.page = this.page;
    
    this.myTicketsService.getUpcomingEvents(request).subscribe(response => {
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
