import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { TicketPreviewModel } from '../../tickets/models/ticket-preview-model';
import { IDateRangePickerOptions } from 'ngx-daterange'
import { GetMarketplaceMySalesRequest } from 'src/app/services/models/get-marketplace-mysales-request';
import { MarketplaceService } from '../../services/marketplace-service';
import * as moment from 'moment';



@Component({
  selector: 'app-my-tickets',
  templateUrl: './my-tickets.component.html',
  styleUrls: ['./my-tickets.component.css']
})
export class MyTicketsComponent implements OnInit {

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
  fromDate;
  toDate;
  closeResult: string;

  dateOptions: IDateRangePickerOptions = {
    autoApply: true,
    //Change to be dynamic
    minDate: moment("2013-06-30T00:00:00+02:00"),
    maxDate: moment("2022-10-30T00:00:00+02:00"),
    format: "YYYY-MM-DD"
  }

  getFromToDate(range) {
    this.fromDate = moment(range.split(" - ")[0]).utcOffset(2).format();
    this.toDate = moment(range.split(" - ")[1]).utcOffset(2).format();
  }


  constructor(private modalService: NgbModal, private marketplaceService: MarketplaceService) { }
  open(content) {
    this.modalService.open(content, { size: 'xl' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  open3(content3) {
    this.modalService.open(content3, { centered: true });
  }
  getDismissReason(reason: any) {
    throw new Error("Method not implemented.");
  }

  ngOnInit(): void {

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
      allowSearchFilter: true
    };

    this.getMySalesTickets();
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

