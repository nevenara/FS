import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmPasswordValidator } from 'src/app/shared/Validators/confirm-password';
import { noWhitespaceValidator } from 'src/app/shared/Validators/no-white-space-validator';
import { PasswordValidator } from 'src/app/shared/Validators/password-validator';
import { LinkedAccountsService } from 'src/app/services/linked-accounts-service';
import { LinkedAccount } from '../models/linked-account';
import { ActivatedRoute } from '@angular/router';
import { GetLinkedAccountDetailsRequest } from 'src/app/services/models/get-linked-account-details-request';
import { EditLinkedAccountRequest } from 'src/app/services/models/edit-linked-account-request';
import { SetLinkedAccountPasswordRequest } from 'src/app/services/models/set-linked-account-password-request';
import { UploadProfileImageLinkedAccountRequest } from 'src/app/services/models/upload-profile-image-linked-account-request';
import { Environment } from 'src/app/environments/environment';
import { GetCountriesService } from '../../../services/get-countries-service'
import { NotificationsService } from 'src/app/notifications/services/notifications.service';
import { DeleteProfileImageRequest } from 'src/app/services/models/delete-profile-image-request';
import { RegistrationService } from 'src/app/services/registration-service';
import { DateFormatter } from 'src/app/shared/date-formatter';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
  countries = [];
  selectedCountry;
  closeResult: string;
  form: FormGroup;
  formResetForm: FormGroup;
 
  isSubmit = false;
  isSubmitResetForm = false;
  linkedAccount: LinkedAccount;

  password: string;
  confirmPassword: string;
  dateFormatter: DateFormatter = new DateFormatter();


  profileImageBaseUrl = '';
  profileImageUrl = '';

  loader = false;
  loaderInModal = false;
  loadingError = false;

  constructor(
    private modalService: NgbModal, 
    private linkedAccountsService: LinkedAccountsService,
    private activatedroute: ActivatedRoute,
    private formBuilder: FormBuilder, 
    private router: Router,
    private getCountriesService: GetCountriesService,
    private notificationsService: NotificationsService,
    private registrationService: RegistrationService,
    public translate: TranslateService

  ) { 
  }


  ngOnInit(): void {
    this.loader = true;
    
    this.create();
    this.getCountries();
    this.createResetForm();

    this.activatedroute.params.subscribe(data => {
      this.linkedAccount = new LinkedAccount();
      this.linkedAccount.id = data['id'];
      this.profileImageBaseUrl = Environment.serviceUrl + '/users/profileimage?userId=' + this.linkedAccount.id;
      this.profileImageUrl = this.profileImageBaseUrl;

      let request: GetLinkedAccountDetailsRequest = new GetLinkedAccountDetailsRequest();
      request.linkedAccountId = this.linkedAccount.id;
      

      this.linkedAccountsService.getLinkedAccountDetails(request).subscribe(response => {
        this.linkedAccount = response;
        this.selectedCountry = response.country;
        this.loader = false;
      }, err => {
        console.log(err);
        this.loader = false;
        this.loadingError = true;
      });
    });
  }
  open(content) {
    this.modalService.open(content, { centered: true }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  

  create() {
    this.form = this.formBuilder.group({
     
      address: ['',  [Validators.required, noWhitespaceValidator ]],
      zipCode: ['', [Validators.required, noWhitespaceValidator ]],
      city: ['',  [Validators.required, noWhitespaceValidator ]],
      country: [null, Validators.required],
    });
  }
  createResetForm() {
    this.formResetForm = this.formBuilder.group({
      newPass: ['', [Validators.required, PasswordValidator.patternValidator()]],
      confirmNewPass: ['', Validators.required],
    },
    {
      validator: ConfirmPasswordValidator('newPass', 'confirmNewPass')
    })
    
  }

  get f() { return this.form.controls; }
  get fr() { return this.formResetForm.controls; }

  editLinkedAccount() {
    this.isSubmit = true;
    if (this.form.invalid) { return; }

    this.loader = true;

    let request = new EditLinkedAccountRequest();
    request.linkedAccountId = this.linkedAccount.id;
    request.address = this.linkedAccount.address;
    request.city = this.linkedAccount.city;
    request.country = this.selectedCountry.name;
    request.postCode = this.linkedAccount.postCode;

    this.linkedAccountsService.editLinkedAccount(request).subscribe(response => {
      console.log(response);
      this.loader = false;
      this.translate.get('notifications.profile.linkedAccountUpdated').subscribe((data:any)=> {
        this.notificationsService.showSuccess(data);
      });
    }, err=> {
      this.loader = false;
    });
  }

  setPassword() {
    this.isSubmitResetForm = true;
    if (this.formResetForm.invalid) { 
      return; 
    }

    this.loaderInModal = true;

    let request = new SetLinkedAccountPasswordRequest();
    request.linkedAccountId = this.linkedAccount.id;
    request.password = this.password;
    request.confirmPassword = this.confirmPassword;

    this.linkedAccountsService.setLinkedAccountPassword(request).subscribe(response => {
      console.log(response);
      this.resetPasswordFields();
      this.loaderInModal = false;
      this.translate.get('notifications.profile.linkedAccountPasswordSet').subscribe((data:any)=> {
        this.notificationsService.showSuccess(data);
      });
      this.modalService.dismissAll();
    }, err=> {
      this.loaderInModal = false;
    });
  }

  resetPasswordFields() {
    this.isSubmitResetForm = false;
    this.password = '';
    this.confirmPassword = '';
  }

  uploadImage(event) {
    const request = new UploadProfileImageLinkedAccountRequest();
    request.profileImage = event.target.files[0];
    request.linkedAccountId = this.linkedAccount.id;
    this.linkedAccountsService.uploadProfileImage(request).subscribe(response => {
      
      this.profileImageUrl = this.profileImageBaseUrl + '&random=' + Math.random();
      this.translate.get('notifications.profile.profileImageUploaded').subscribe((data:any)=> {
        this.notificationsService.showSuccess(data);
      });
    }, err => {
      
    });
  }

  deleteImage(event){
    console.log(event)
    const request = new DeleteProfileImageRequest();
    request.userId = this.linkedAccount.id;
    this.registrationService.deleteProfileImage(request).subscribe(response => {
      //this.updateHeaderProfileImageService.updateHeaderProfileImage();
      this.profileImageUrl = this.profileImageBaseUrl + '&random=' + Math.random();
      this.translate.get('notifications.profile.profileImageDeleted').subscribe((data:any)=> {
        this.notificationsService.showSuccess(data);
      });
    }, err => {
    });
  }

  getCountries(){
    this.countries = []
    this.getCountriesService.getCountryList().subscribe(response => {
      this.countries = response;
    }, err => {
      console.log(err);
      this.loadingError = true;
    })
  }

}

