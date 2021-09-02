import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountDetailsPreview } from '../../../models/account-details-preview';
import { UserService } from 'src/app/admin/services/user-service';
import { GetAccountDetailsRequest } from 'src/app/admin/services/models/get-account-details-request';
import { GetLinkedAccountsRequest } from 'src/app/admin/services/models/get-linked-accounts-request';
import { LinkedAccountsPreview } from 'src/app/admin/models/linked-account-preview';
import { Environment } from 'src/app/environments/environment';
import { UserDetailsPreview } from 'src/app/admin/models/user-details-preview';
import { AddEmailRequest } from 'src/app/admin/services/models/add-email-request';
import { EditEmailRequest } from 'src/app/admin/services/models/edit-email-request';
import { NotificationsService } from 'src/app/notifications/services/notifications.service';
import { DeleteEmailRequest } from 'src/app/admin/services/models/delete-email-request';
import { AuthenticationService } from 'src/app/services/authentication-service';
import { UserType } from 'src/app/services/models/user-context';

@Component({
  selector: 'app-account-detail',
  templateUrl: './account-detail.component.html',
  styleUrls: ['./account-detail.component.css']
})
export class AccountDetailComponent implements OnInit {
  @Output()  linkedAccountClick = new EventEmitter();
  @Input() index: number;
  @Input() selectedEmail: any;
  @Input() user: UserDetailsPreview;
 
  closeResult = '';
  form: FormGroup;
  isSubmit = false;

  userId: string;
  profileImageBaseUrl = Environment.serviceUrl + '/users/profileimage';
  profileImageUrl = '';
  account: AccountDetailsPreview = new AccountDetailsPreview();
  linkedAccounts: Array<LinkedAccountsPreview> = [];

  loader = true;
  loadError = false;

  emailEdit;
  selectedIndex = -1;
  editing = false;
  newEmail = '';
  isAddSubmit = false;
  addForm: FormGroup;

  userType: UserType;

  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder, 
    private router: Router,
    private route: ActivatedRoute, 
    private userService: UserService,
    private notificationsService: NotificationsService,
    private authService: AuthenticationService
  ) { }


  open1(content1) {
    this.modalService.open(content1, { centered: true});
  }

  ngOnInit(): void {
    this.create()

    this.route.params.subscribe(data => {
      console.log(data['userId']);
      this.userId = data['userId'];
    });

    this.profileImageUrl = this.profileImageBaseUrl + '?userId=' + this.userId;

    this.getUserType();
    this.getAccountDetails();
    this.getLinkedAccounts();

  }

  getUserType() {
    this.authService.getUserType().subscribe(response => {
      this.userType = response.userType;
    })
  }

  create() {
    this.form = this.formBuilder.group({
      emailEdit: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
    });

    this.addForm = this.formBuilder.group({
      newEmail: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
    });
  }

  getAccountDetails(){
    let request = new GetAccountDetailsRequest();
    request.userId = this.userId;

    this.userService.getAccountDetails(request).subscribe(response => {
       console.log(response);
       this.loader = false;
       this.account = response;
       console.log(this.account.additionalEmails);
    }, error => {
      console.log(error);
      this.loadError = true;
      this.loader = false;
    });
  }

  getLinkedAccounts(){
    let request = new GetLinkedAccountsRequest();
    request.userId = this.userId;

    this.userService.getLinkedAccounts(request).subscribe(response => {
       console.log(response);
       this.loader = false;
       this.linkedAccounts = response.linkedAccounts;
    }, error => {
      console.log(error);
      this.loadError = true;
      this.loader = false;
    });
  }

  startEditingEmail(i) {
    this.editing = true;
    this.selectedIndex = i;
    this.emailEdit = this.account.additionalEmails[i].email;
  }

  editEmail(i) {
    this.isSubmit = true;
    if (this.form.invalid) { return; }

    this.loader = true;

    let request: EditEmailRequest = new EditEmailRequest();
    request.newEmail = this.emailEdit;
    request.oldEmail = this.account.additionalEmails[i].email;
    request.userId = this.user.userId;

    this.userService.editEmail(request).subscribe(response => {
      console.log(response);
      this.notificationsService.showSuccess('Email is successfully updated');
      this.getAccountDetails();
      this.cancelEditing();
    }, error => {
      console.log(error);
      this.loader = false;
    });
  }

  addNewEmail() {
    this.isAddSubmit = true;
    if (this.addForm.invalid) { return; }
    this.isAddSubmit = false;

    this.loader = true;

    let request: AddEmailRequest = new AddEmailRequest();
    request.email = this.newEmail;
    request.userId = this.user.userId;

    this.userService.addEmail(request).subscribe(response => {
      console.log(response);
      this.newEmail = '';
      this.notificationsService.showSuccess('Email is successfully added');
      this.getAccountDetails();
    }, error => {
      console.log(error);
      this.loader = false;
    });
  }

  cancelEditing() {
    this.editing = false;
    this.selectedIndex = -1;
  }

  deleteEmail() {
    this.loader = true;

    let request: DeleteEmailRequest = new DeleteEmailRequest();
    request.email = this.selectedEmail.email;
    request.userId = this.user.userId;

    this.userService.deleteEmail(request).subscribe(response => {
      console.log(response);
      this.notificationsService.showSuccess('Email is successfully deleted');
      this.getAccountDetails();
    }, error => {
      console.log(error);
      this.loader = false;
    });
  }

  useAsStandardEmail(){
    this.loader = true;
    this.userService.useAsStandardEmail({ userId: this.userId, email: this.selectedEmail.email }).subscribe(response => {
      this.notificationsService.showSuccess('Standard email is successfully updated');
      this.getAccountDetails();
    }, error => {
      console.log(error);
      this.loader = false;
    })
  }

  get f() { return this.form.controls; }
  get fa() { return this.addForm.controls; }

}
