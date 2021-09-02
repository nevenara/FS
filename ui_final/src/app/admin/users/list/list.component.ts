import { Component, OnInit } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { from } from 'rxjs';
import { UserService } from '../../services/user-service';
import { SearchUsersRequest, SearchAdminPanelUsersAccountType, ReasonForInactivity, SearchAdminPanelUsersStatus } from '../../services/models/search-users-request'
import { IDateRangePickerOptions } from 'ngx-daterange';
import { DateFormatter } from '../../../shared/date-formatter';
import * as moment from 'moment-timezone';
import { saveAs } from "file-saver";
import { UserPreview } from '../../models/user-preview'
import { AuthenticationService } from 'src/app/services/authentication-service';
import { UserType } from 'src/app/services/models/user-context';



@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
  providers: [SearchUsersRequest],
})
export class ListComponent implements OnInit {

  statusDropdown = [];
  selectedStatus = [];
  pages = [];
  users: Array<UserPreview> = [];
  searchUsersRequest: SearchUsersRequest = new SearchUsersRequest();
  totalRecords = 1;
  dropdownSettings: IDropdownSettings = {};
  accountTypeDropdown = [];
  searchedText: string = '';
  selectedAccountType = [];
  reasonForInactivityDropdown = [];
  selectedReasonForInactivity = [];
  verificationFromDate;
  verificationToDate;
  signUpFromDate;
  signUpToDate;
  model;
  right;
  dateFormatter: DateFormatter = new DateFormatter();

  loader: boolean;


  showLimits = [10, 25, 50];


  dateOptions: IDateRangePickerOptions = {
    autoApply: true,
    //Change to be dynamic
    clickOutsideAllowed: false,
    format: "DD.MM.YYYY"
  }

  userType: UserType;

  getVerificationFromToDate(range) {
    if (range) {
      this.verificationFromDate = moment(range.split(" - ")[0], "DDMMYYYY").tz("Europe/Vienna").format();
      this.verificationToDate = moment(range.split(" - ")[1], "DDMMYYYY").tz("Europe/Vienna").format();
      this.searchUsersRequest.verificationDateFrom = this.verificationFromDate;
      this.searchUsersRequest.verificationDateTo = this.verificationToDate;
      this.searchUsers();
    } else {
      this.verificationFromDate = null;
      this.verificationToDate = null;
      this.searchUsersRequest.verificationDateFrom = this.verificationFromDate;
      this.searchUsersRequest.verificationDateTo = this.verificationToDate;
    }
  }

  resetDate(){
    this.searchUsersRequest.signUpDateFrom = null;
    this.searchUsersRequest.signUpDateTo = null;
    this.searchUsersRequest.verificationDateFrom = null;
    this.searchUsersRequest.verificationDateTo = null;
  }

  geSignUpFromToDate(range) {
    if (range) {
      this.signUpFromDate = moment(range.split(" - ")[0], "DDMMYYYY").tz("Europe/Vienna").format();
      this.signUpToDate = moment(range.split(" - ")[1],"DDMMYYYY").tz("Europe/Vienna").format();
      this.searchUsersRequest.signUpDateFrom = this.signUpFromDate;
      this.searchUsersRequest.signUpDateTo = this.signUpToDate;
      this.searchUsers();
    } else {
      this.signUpFromDate = null;
      this.signUpToDate = null;
      this.searchUsersRequest.signUpDateFrom = this.signUpFromDate;
      this.searchUsersRequest.signUpDateTo = this.signUpToDate;
    }
  }

  constructor(private userService: UserService, private authService: AuthenticationService) { }

  ngOnInit(): void {

    this.loader = true;
    this.searchUsersRequest.limit = this.showLimits[0];
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 1,
      allowSearchFilter: true
    };

    this.statusDropdown = [
      { item_id: 1, item_text: "Registered" },
      { item_id: 2, item_text: "Verified" },
      { item_id: 3, item_text: "VerifiedInclBankAccount" },
      { item_id: 4, item_text: "Inactive" },

    ];
    this.accountTypeDropdown = [
      { item_id: 1, item_text: SearchAdminPanelUsersAccountType.MainAccount },
      { item_id: 2, item_text: SearchAdminPanelUsersAccountType.LinkedAccount }
    ];




    this.reasonForInactivityDropdown = [
      { item_id: 1, item_text: ReasonForInactivity.MainAccountDeleted },
      { item_id: 2, item_text: ReasonForInactivity.MisuseLinkedAccounts },
      { item_id: 3, item_text: ReasonForInactivity.SuspectedTicketTrading },
      { item_id: 4, item_text: ReasonForInactivity.UserRequested },
      { item_id: 5, item_text: ReasonForInactivity.UserVerificationInvalid },
    ];

    this.getUserType();
    this.searchUsers();
  }

  getUserType() {
    this.authService.getUserType().subscribe(response => {
      this.userType = response.userType;
    })
  }

  selectAllAccountTypes() {
    this.selectedAccountType = [];
    for (let i = 0; i < this.accountTypeDropdown.length; i++) {
      this.selectedAccountType.push(this.accountTypeDropdown[i]);
      console.log(this.selectedAccountType)
    }
    this.searchUsers();
  }

  getStatus(status) {
    switch (status) {
      case 1:
        return "Registered"
      case 2:
        return "Verified"
      case 3:
        return "VerifiedInclBankAccount"
      case 4:
        return "Inactive"
        
      default: return "";
    }
  }

  selectAllReasonsForInactivity() {
    this.selectedReasonForInactivity = [];
    for (let i = 0; i < this.reasonForInactivityDropdown.length; i++) {
      this.selectedReasonForInactivity.push(this.reasonForInactivityDropdown[i]);
      console.log(this.selectedReasonForInactivity)
    }
    this.searchUsers();
  }

  selectAllStatuses() {
    this.selectedStatus = [];
    for (let i = 0; i < this.statusDropdown.length; i++) {
      this.selectedStatus.push(this.statusDropdown[i]);
      console.log(this.selectedStatus)
    }
    this.searchUsers();
  }

  unselectAllReasonsForInactivity() {
    this.selectedReasonForInactivity = [];
    this.searchUsers();
  }

  unselectAllAccountTypes() {
    this.selectedAccountType = [];
    this.searchUsers();
  }

  unselectAllStatuses() {
    this.selectedStatus = [];
    this.searchUsers();
  }

  next() {
    if (this.searchUsersRequest.page < this.pages.length) {
      this.searchUsersRequest.page++;
      this.searchUsers(true);
    }
  }

  previous() {
    if (this.searchUsersRequest.page > 1) {
      this.searchUsersRequest.page--;
      this.searchUsers(true);
    }
  }

  onLimitChange() {
    this.searchUsers();
  }

  onTextChange() {
    this.searchUsers();
  }

  getFromPage() {
    return (this.searchUsersRequest.page - 1) * this.searchUsersRequest.limit + 1;
  }

  getToPage() {
    return Math.min(this.searchUsersRequest.page * this.searchUsersRequest.limit, this.totalRecords);
  }

  onPageChange(page) {
    console.log(page);
    this.searchUsersRequest.page = page;
    this.searchUsers(true);
  }

  exportExcel() {
    this.userService.exportExcel(this.searchUsersRequest).subscribe(response => {
      saveAs(response, 'users');
    }, error => {
      console.log(error);
    });
  }

  exportCsv() {
    this.userService.exportCsv(this.searchUsersRequest).subscribe(response => {
      saveAs(response, 'users.csv');
    }, error => {
      console.log(error);
    });
  }

  exportPdf() {
    this.userService.exportPdf(this.searchUsersRequest).subscribe(response => {
      saveAs(response, 'users');
    }, error => {
      console.log(error);
    });
  }

  searchUsers(changePage = false) {
    if (!changePage) {
      this.searchUsersRequest.page = 1;
    }
    this.loader = true;
    this.searchUsersRequest.textSearch = this.searchedText;
    this.searchUsersRequest.accountType = []
    this.searchUsersRequest.reasonForInactivity = []
    this.searchUsersRequest.status = []
    for (let i = 0; i < this.selectedAccountType.length; i++) {
      this.searchUsersRequest.accountType.push(this.selectedAccountType[i].item_text);
    }
    for (let j = 0; j < this.selectedReasonForInactivity.length; j++) {
      this.searchUsersRequest.reasonForInactivity.push(this.selectedReasonForInactivity[j].item_text);
    }
    for (let k = 0; k < this.selectedStatus.length; k++) {
      this.searchUsersRequest.status.push(this.selectedStatus[k].item_id);
    }
    this.userService.searchUsers(this.searchUsersRequest).subscribe(response => {
      this.users = response.users;
      this.totalRecords = response.totalRecords;
      this.pages = [];
      for (let i = 0; i < response.totalPages; i++) {
        this.pages.push(i + 1);
      }
      console.log(response)
      this.loader = false
    }, error => {
      this.loader = false
      console.log(error);
    });

  }




}







