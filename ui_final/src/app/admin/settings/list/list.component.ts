import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { noWhitespaceValidator } from 'src/app/shared/Validators/no-white-space-validator';
import { UserManagementService } from '../../services/user-management-service';
import { SearchUserManagementRequest } from '../../services/models/search-user-management-request';
import { DateFormatter } from 'src/app/shared/date-formatter';
import { UserManagementPreview } from '../../models/user-management-preview';
import { IDateRangePickerOptions } from 'ngx-daterange';
import * as moment from 'moment';
import { saveAs } from "file-saver";
import { UserType } from 'src/app/services/models/user-context';
import { AddUserManagementRequest } from '../../services/models/add-user-management-request';
import { EditUserManagementRequest } from '../../services/models/edit-user-management-request';
import { DeleteUserManagementRequest } from '../../services/models/delete-user-management-request';
import { NotificationsService } from 'src/app/notifications/services/notifications.service';
import { PasswordRecoveryService } from 'src/app/services/password-recovery-service';
import { PasswordRecoveryInitRequest } from 'src/app/services/models/password-recovery-init-request';
import { AuthenticationService } from 'src/app/services/authentication-service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  dropdownList = [];
  selectedItems = [];

  dropdownListAdmin = [];
  dropdownListSuperAdmin = [];

  dropdownSettings :IDropdownSettings = {};
  
  permissions = [];

  formAdd: FormGroup;
  formEdit: FormGroup;

  isSubmit = false;
  isEdit = false;

  request: SearchUserManagementRequest = new SearchUserManagementRequest();
  addRequest: AddUserManagementRequest = new AddUserManagementRequest();
  editRequest: EditUserManagementRequest = new EditUserManagementRequest();
  deleteRequest: DeleteUserManagementRequest = new DeleteUserManagementRequest();

  dateFormatter: DateFormatter = new DateFormatter();

  pages = [];
  totalRecords = 15;

  showLimits = [10, 25, 50];

  loader = false;

  users: Array<UserManagementPreview> = [];
  selectedUser: string;
  selectedEmail: string;

  modal;

  dateOptions: IDateRangePickerOptions = {
    autoApply: true,
    //Change to be dynamic
     maxDate: moment(),
     clickOutsideAllowed: false,
     format: "DD.MM.YYYY"
  }

  persmissionMap = [];

  userType: UserType;
  
  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private userManagementService: UserManagementService,
    private notificationsService: NotificationsService,
    private passwordRecoveryService: PasswordRecoveryService,
    private authService: AuthenticationService
  ) { }

  ngOnInit(): void {
    this.dropdownList = [
      { item_id: UserType.SuperAdmin, item_text: 'Super-Admin' },
      { item_id: UserType.Admin, item_text: 'Admin' },
      { item_id: UserType.SupportLevel1, item_text: 'Support Level 1' },
      { item_id: UserType.SupportLevel2, item_text: 'Support Level 2' },
      { item_id: UserType.EventManager, item_text: 'Event Manager' },
    ];

    this.dropdownListAdmin = [
      { item_id: UserType.SupportLevel1, item_text: 'Support Level 1' },
      { item_id: UserType.SupportLevel2, item_text: 'Support Level 2' },
      { item_id: UserType.EventManager, item_text: 'Event Manager' },
    ];

    this.dropdownListSuperAdmin = [
      { item_id: UserType.SuperAdmin, item_text: 'Super-Admin' },
      { item_id: UserType.Admin, item_text: 'Admin' },
      { item_id: UserType.SupportLevel1, item_text: 'Support Level 1' },
      { item_id: UserType.SupportLevel2, item_text: 'Support Level 2' },
      { item_id: UserType.EventManager, item_text: 'Event Manager' },
    ];

    for (let i = 0; i < this.dropdownList.length; i++) {
      this.persmissionMap[this.dropdownList[i].item_id] = this.dropdownList[i].item_text;
    }

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

    this.request.limit = this.showLimits[0];

    this.create()

    this.getUserType();

    this.searchUsers();
  }

  getUserType() {
    this.authService.getUserType().subscribe(response => {
      this.userType = response.userType;
    })
  }

  open(content) {
    this.modal = this.modalService.open(content, { centered: true });
  }

  create() {
    this.formAdd = this.formBuilder.group({
      firstname: ['', [Validators.required, noWhitespaceValidator ]],
      lastname: ['', [Validators.required, noWhitespaceValidator ]],
      Email  : ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
      Permission: ['', Validators.required],
    });

    this.formEdit = this.formBuilder.group({
      FirstNameedit: ['', [Validators.required, noWhitespaceValidator ]],
      LastNameedit: ['', [Validators.required, noWhitespaceValidator ]],
      Emailedit: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
      Permissionedit: ['', Validators.required],
    });

  }
 
  get fa() { return this.formAdd.controls; }
  get fe() { return this.formEdit.controls; }

  unselectAll() {
    this.selectedItems = [];
    this.searchUsers();
  }
  
  onSelectAll(items: any) {
    this.selectedItems = [];
    for (let i = 0; i < this.dropdownList.length; i++) {
      this.selectedItems.push(this.dropdownList[i]);
    }
    this.searchUsers();
  }

  next() {
    if (this.request.page < this.pages.length) {
      this.request.page++;
      this.searchUsers(true);
    }
  }

  previous() {
    if (this.request.page > 1) {
      this.request.page--;
      this.searchUsers(true);
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
    this.searchUsers(true);
  }

  onLimitChange() {
    this.searchUsers();
  }

  getFromToDate(range){
    if (range) {
      this.request.lastLoginFrom = moment(range.split(" - ")[0], 'DD.MM.YYYY').tz("Europe/Vienna").format();
      this.request.lastLoginTo = moment(range.split(" - ")[1], 'DD.MM.YYYY').tz("Europe/Vienna").format();
      this.searchUsers();
    } else {
      this.request.lastLoginFrom = null;
      this.request.lastLoginTo = null;
    }
  }

  resetDate(){
    this.request.lastLoginFrom = null;
    this.request.lastLoginTo = null;

  }

  prepareEditRequest(i) {
    this.editRequest.email = this.users[i].email;
    this.editRequest.firstname = this.users[i].firstname;
    this.editRequest.lastname = this.users[i].lastname;
    this.editRequest.permissions = this.users[i].permissions;
  }

  searchUsers(changePage = false) {
    if (!changePage) {
      this.request.page = 1;
    }
    
    this.loader = true;

    this.request.permissions = [];
    for (let i = 0; i < this.selectedItems.length; i++) {
      this.request.permissions.push(this.selectedItems[i].item_id);
    }
    
    this.userManagementService.search(this.request).subscribe(response => {
      console.log(response);
      this.users = response.users;
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
    this.userManagementService.exportExcel(this.request).subscribe(response => {
      saveAs(response, 'users');
    }, error => {
      console.log(error);
    });
  }

  exportCsv() {
    this.userManagementService.exportCsv(this.request).subscribe(response => {
      saveAs(response, 'users.csv');
    }, error => {
      console.log(error);
    });
  }

  exportPdf() {
    this.userManagementService.exportPdf(this.request).subscribe(response => {
      saveAs(response, 'users');
    }, error => {
      console.log(error);
    });
  }

  addUser() {
    this.isSubmit = true;
    if (this.formAdd.invalid) { return; }

    this.userManagementService.addUser(this.addRequest).subscribe(response => {
      this.notificationsService.showSuccess('User is successfully added!');
      this.searchUsers();
      this.modal.close();
    }, error => {
      console.log(error);
    })
  }

  editUser() {
    this.isEdit = true;
    if(this.formEdit.invalid)
    {
      return;
    }

    this.editRequest.userId = this.selectedUser;

    this.userManagementService.editUser(this.editRequest).subscribe(response => {
      this.notificationsService.showSuccess('User is successfully edited!');
      this.searchUsers();
      this.modal.close();
    }, error => {
      console.log(error);
    })
  }

  deleteUser() {
    this.deleteRequest.userId = this.selectedUser;

    this.userManagementService.deleteUser(this.deleteRequest).subscribe(response => {
      this.notificationsService.showSuccess('User is successfully deleted!');
      this.searchUsers();
      this.modal.close();
    }, error => {
      console.log(error);
    })
  }

  sendPasswordRecoveryLink() {
    let passwordRecoveryRequest = new PasswordRecoveryInitRequest();
    passwordRecoveryRequest.email = this.selectedEmail;

    this.passwordRecoveryService.resetPasswordGenerateLink(passwordRecoveryRequest).subscribe(response => {
      this.notificationsService.showSuccess("Password recovery link is successfully sent!");
    }, error => {
      console.log(error);
    })
  }

}
