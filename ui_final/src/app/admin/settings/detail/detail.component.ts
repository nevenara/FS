import { Component, OnInit } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { SearchOrganizerSupportRequest } from '../../services/models/search-organizer-support-request';
import { OrganizerService } from '../../services/organizer-service';
import { OrganizerSupportModel } from '../models/organizer-support-model'
import { saveAs } from "file-saver";
import * as moment from 'moment-timezone';
import { IDateRangePickerOptions } from 'ngx-daterange';
import { ProxyAdminLoginRequest } from '../../services/models/proxy-admin-login-request';
import { Environment } from 'src/app/environments/environment';
import { ApplicationType, RedirectionUrls } from 'src/app/shared/application-type';
import { UserType } from 'src/app/services/models/user-context';
import { AuthenticationService } from 'src/app/services/authentication-service';
import { DateFormatter } from 'src/app/shared/date-formatter';


@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css'],
  providers: [SearchOrganizerSupportRequest]
})
export class DetailComponent implements OnInit {

  dropdownList = [];
  selectedItems = [];
  dropdownSettings :IDropdownSettings = {};
  model;
  organizerSupport: Array<OrganizerSupportModel> = [];
  dateFormatter: DateFormatter = new DateFormatter();

  closeResult = '';
  companyName: string;
  createdFrom: Date;
  createdTo: Date;
  pages = [];
  totalRecords = 15;
  fromDate;
  toDate;
  showLimits = [10, 25, 50];

  loader = false;

  userType: UserType;

  constructor(private organizerService: OrganizerService, public searchOrganizerSupportRequest: SearchOrganizerSupportRequest, private authService: AuthenticationService) { }

  ngOnInit(): void {

      this.dropdownList = [
        { item_id: 1, item_text: 'Active' },
        { item_id: 2, item_text: 'Inactive' },
      ];
      this.selectedItems = [];
      this.dropdownSettings = {
        singleSelection: false,
        idField: 'item_id',
        textField: 'item_text',
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        itemsShowLimit: 1,
      };

      this.searchOrganizerSupportRequest.limit = this.showLimits[0];
      this.getUserType();
      this.searchOrganizerSupport()


  }

  getUserType() {
    this.authService.getUserType().subscribe(response => {
      this.userType = response.userType;
    })
  }

  unselectAll() {
    this.selectedItems = [];
    this.searchOrganizerSupport();
  }
  
  onSelectAll(items: any) {
    this.selectedItems = [];
    for (let i = 0; i < this.dropdownList.length; i++) {
      this.selectedItems.push(this.dropdownList[i]);
    }
    this.searchOrganizerSupport();
  }

  next() {
    if (this.searchOrganizerSupportRequest.page < this.pages.length) {
      this.searchOrganizerSupportRequest.page++;
      this.searchOrganizerSupport(true);
    }
  }

  previous() {
    if (this.searchOrganizerSupportRequest.page > 1) {
      this.searchOrganizerSupportRequest.page--;
      this.searchOrganizerSupport(true);
    }
  }

  getFromPage() {
    return (this.searchOrganizerSupportRequest.page - 1) * this.searchOrganizerSupportRequest.limit + 1;
  }

  getToPage() {
    return Math.min(this.searchOrganizerSupportRequest.page * this.searchOrganizerSupportRequest.limit, this.totalRecords);
  }

  onPageChange(page) {
    console.log(page);
    this.searchOrganizerSupportRequest.page = page;
    this.searchOrganizerSupport(true);
  }

  onLimitChange() {
    this.searchOrganizerSupport();
  }

  dateOptions: IDateRangePickerOptions = {
    autoApply: true,
    //Change to be dynamic
    clickOutsideAllowed: false,
    format: "DD.MM.YYYY"
  }

  getVerificationFromToDate(range) {
    if (range) {
      this.fromDate = moment(range.split(" - ")[0], "DDMMYYYY").tz("Europe/Vienna").format();
      this.toDate = moment(range.split(" - ")[1], "DDMMYYYY").tz("Europe/Vienna").format();
      this.searchOrganizerSupportRequest.createdFrom = this.fromDate;
      this.searchOrganizerSupportRequest.createdTo = this.toDate;
      this.searchOrganizerSupport();
    } else {
      this.fromDate = null;
      this.toDate = null;
      this.searchOrganizerSupportRequest.createdFrom = this.fromDate;
      this.searchOrganizerSupportRequest.createdTo = this.toDate;
    }
  }

  resetDate(){
    this.searchOrganizerSupportRequest.createdFrom = null;
    this.searchOrganizerSupportRequest.createdTo = null;

  }


  searchOrganizerSupport(changePage = false){
    this.loader = true;
    if (!changePage) {
      this.searchOrganizerSupportRequest.page = 1;
    }

    this.searchOrganizerSupportRequest.status = [];
    for (let i = 0; i < this.selectedItems.length; i++) {
      this.searchOrganizerSupportRequest.status.push(this.selectedItems[i].item_text);
    }
  
    this.searchOrganizerSupportRequest.companyName = this.companyName;

  this.organizerService.searchOrganizerSupport(this.searchOrganizerSupportRequest).subscribe(response => {
  this.organizerSupport = response.organizers;
  this.totalRecords = response.totalRecords;
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


  exportExcel() {
    this.organizerService.exportSupportExcel(this.searchOrganizerSupportRequest).subscribe(response => {
      saveAs(response, 'organizerSupport');
    }, error => {
      console.log(error);
    });
  }

  exportCsv() {
    this.organizerService.exportSupportCsv(this.searchOrganizerSupportRequest).subscribe(response => {
      saveAs(response, 'organizerSupport.csv');
    }, error => {
      console.log(error);
    });
  }

  exportPdf() {
    this.organizerService.exportSupportPdf(this.searchOrganizerSupportRequest).subscribe(response => {
      saveAs(response, 'organizerSupport');
    }, error => {
      console.log(error);
    });
  }

  loginAsOrganizer(organizerId) {
    let request: ProxyAdminLoginRequest = new ProxyAdminLoginRequest();
    request.userId = organizerId;

    this.organizerService.proxyLogin(request).subscribe(response => {
      window.open(
        Environment.organizerUrl + RedirectionUrls[ApplicationType.ORGANIZER].home,
        '_blank'
      );
    })
  }

}
