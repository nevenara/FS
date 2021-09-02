import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { noWhitespaceValidator } from 'src/app/shared/Validators/no-white-space-validator';
import { CountryISO, SearchCountryField, TooltipLabel } from 'ngx-intl-tel-input';
import { UserService } from '../../../services/user-service';
import { UserDetailsPreview } from '../../../models/user-details-preview';
import { Environment } from 'src/app/environments/environment';
import { GetCountriesService } from 'src/app/services/get-countries-service';
import { PasswordRecoveryService } from 'src/app/services/password-recovery-service';
import { PasswordRecoveryInitRequest } from 'src/app/services/models/password-recovery-init-request';
import { DeactivateUserRequest } from 'src/app/admin/services/models/deactivate-user-request';
import { ActivateUserRequest } from 'src/app/admin/services/models/activate-user-request';
import { DeleteUserRequest } from 'src/app/admin/services/models/delete-user-request';
import { UpdateUserAdminPanelRequest } from 'src/app/admin/services/models/update-user-admin-panel-request';
import { UploadImageRequest } from 'src/app/admin/services/models/upload-image-request';
import { DeleteImageRequest } from 'src/app/admin/services/models/delete-image-request';
import { RegistrationService } from 'src/app/services/registration-service';
import { NotificationsService } from 'src/app/notifications/services/notifications.service';
import { AuthenticationService } from 'src/app/services/authentication-service';
import { UserType } from 'src/app/services/models/user-context';


@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit, AfterViewInit {

  separateDialCode = false;
	SearchCountryField = SearchCountryField;
	TooltipLabel = TooltipLabel;
	CountryISO = CountryISO;
  preferredCountries: CountryISO[] = [CountryISO.Austria];


  datemodel: {day, month, year};
  emptyDate: boolean = false;
  date;
  currentDate = new Date();
  minDate={year: 1920, month:1, day: 1}
  maxDate= {year: this.currentDate.getFullYear(), month: this.currentDate.getMonth() + 1, day: this.currentDate.getDay() - 1}
  model: NgbDateStruct = { day: this.currentDate.getDate(), month: this.currentDate.getMonth(), year: this.currentDate.getFullYear()}
  reasons = [];
  reason;

  @Input() user: UserDetailsPreview = new UserDetailsPreview();

  profileImageBaseUrl = Environment.serviceUrl + '/users/profileimage';
  profileImageUrl = '';
  

  countries = [];
  loader = false;
  loadError = false;

  // check(){
  //  this.Userstatus="Activate"
  // }
  closeResult = '';
  form: FormGroup;
  isSubmit = false;
  Userstatus="Deactivate"
  userType: UserType;

  statusText;
  
  @Output() refreshPageEmitter: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder, 
    private router: Router, 
    private userService: UserService,
    private getCountriesService: GetCountriesService,
    private passwordRecoveryService: PasswordRecoveryService,
    private registrationService: RegistrationService,
    private notificationsService: NotificationsService,
    private authService: AuthenticationService
    ) { }

    timeSince(date) {
      var seconds = Math.floor((((new Date()).getTime() - (new Date(date).getTime())) / 1000));
      var interval = seconds / 31536000;
    
      if (interval > 1) {
        return Math.floor(interval) + " years";
      }
      interval = seconds / 2592000;
      if (interval > 1) {
        return Math.floor(interval) + " months";
      }
      interval = seconds / 86400;
      if (interval > 1) {
        return Math.floor(interval) + " days";
      }
      interval = seconds / 3600;
      if (interval > 1) {
        return Math.floor(interval) + " hours";
      }
      interval = seconds / 60;
      if (interval > 1) {
        return Math.floor(interval) + " minutes";
      }
      return Math.floor(seconds) + " seconds";
    }
  
    setDate(){
      this.datemodel = {day:this.model.day, month: this.model.month, year:this.model.year}
        if(this.datemodel.day < 10){
        this.datemodel.day = "0" +  this.datemodel.day;
      }
      if(this.datemodel.month < 10){
        this.datemodel.month = "0" +  this.datemodel.month;
      }
      this.date = this.datemodel.month.toString() + '/' + this.datemodel.day.toString() + '/' +  this.datemodel.year.toString()
      this.validateDate();
    }

    validateDate(){
      console.log("this model is: " + this.model)
      if(this.model == undefined){
        this.emptyDate = true;
        return false;
      }
      else{
        this.emptyDate = false;
        this.user.dayOfBirth = this.date;
        console.log("current date is " + this.user.dayOfBirth)
      }
    }

  open1(content1) {
    this.modalService.open(content1, { centered: true });
  }
  open2(content2) {
    this.modalService.open(content2, { centered: true });
  }
  open3(content3) {
    this.modalService.open(content3, { centered: true });
  }
  open4(content4) {
    this.modalService.open(content4, { centered: true });
  }

  ngOnInit(): void {
    this.create();
    this.profileImageUrl = this.profileImageBaseUrl + '?userId=' + this.user.userId;
    this.model = Object.assign({}, this.model, {day: new Date(this.user.dayOfBirth).getDate(), month: new Date(this.user.dayOfBirth).getMonth() + 1, year: new Date(this.user.dayOfBirth).getFullYear()});
    this.getCountries();
    this.getReasonsForDeactivation();   
    this.getUserType(); 
    this.statusText = this.getStatus(this.user.status);
  }

  ngAfterViewInit() {
    
  }

  getUserType() {
    this.authService.getUserType().subscribe(response => {
      this.userType = response.userType;
    })
  }

  create() {
    this.form = this.formBuilder.group({

      gender: ['male', Validators.required],
      firstName: ['', [Validators.required, noWhitespaceValidator ]],
      lastName: ['', [Validators.required, noWhitespaceValidator ]],
      address: ['', [Validators.required, noWhitespaceValidator ]],
      zipCode: ['', [Validators.required, noWhitespaceValidator ]],
      city: ['', [Validators.required, noWhitespaceValidator ]],
      country: [null, Validators.required],
      Phonenumber: ['', [Validators.required, noWhitespaceValidator ]],
      reason: []
    });

  }
  get f() { return this.form.controls; }
  onSubmit() {
    this.isSubmit = true;
    if (this.form.invalid) { return; }

    this.loader = true;
    
    const request: UpdateUserAdminPanelRequest = new UpdateUserAdminPanelRequest();
    request.firstname = this.user.firstName;
    request.lastname = this.user.lastName;
    request.address = this.user.address;
    request.gender = +this.user.gender;
    request.birthDate = this.user.dayOfBirth;
    request.city = this.user.city;
    request.country = this.user.country;
    request.postCode = this.user.postalCode;
    request.userId = this.user.userId;
    request.phone = this.user.phone.e164Number;
    this.loader = true;
    this.userService.updateUser(request).subscribe(response => {
      this.loader = false;
      this.notificationsService.showSuccess("Profile is successfully updated")
    }, err => {
      console.log(err);
      this.loader = false;
    });

  }

  getCountries(){
    this.countries = []
    this.getCountriesService.getCountryList().subscribe(response => {
     this.countries = response;
    }, err => {
      console.log(err);
    })
  }

  getReasonsForDeactivation(){
    this.reasons = []
    this.userService.getReasonsForDeactivation().subscribe(response => {
     this.reasons = response.reasons;
    }, err => {
      console.log(err);
    })
  }

  getStatus(status) {
    this.Userstatus = "Deactivate";
    switch (status) {
      case 1:
        return "Registered";
      case 2:
        return "Verified";
      case 3:
        return "Verified incl. Bank Account";
      case 4:
        this.Userstatus = "Activate";
        return "Inactive"
        
      default: return "";
    }
  }

  resetPassword(){
    const request = new PasswordRecoveryInitRequest();
    request.email = this.user.standardEmail;
    this.loader = true;
    this.passwordRecoveryService.resetPasswordGenerateLink(request).subscribe(response => {
      console.log(response);
      this.notificationsService.showSuccess('Reset password link successfully sent.');
      this.loader = false;
    }, err => {
      console.log(err);
      this.loader = false;
    });
  }

  activateOrDeactivate(){
    this.loader = true;

    if(this.Userstatus == "Deactivate") {
      const request = new DeactivateUserRequest();
      request.userId = this.user.userId;
      request.reasonForDeactivation = this.reason;

      this.userService.deactivateUser(request).subscribe(response => {
        console.log(response);
        this.loader = false;
        this.Userstatus = "Activate";
        this.notificationsService.showSuccess('User is deactivated');
        this.refreshPageEmitter.emit();
      }, err => {
        console.log(err);
        this.loader = false;
      });
    }

    else if(this.Userstatus == "Activate") {
      const request = new ActivateUserRequest();
      request.userId = this.user.userId;

      this.userService.activateUser(request).subscribe(response => {
        console.log(response);
        this.loader = false;
        this.Userstatus = "Deactivate";
        this.notificationsService.showSuccess('User is activated');
        this.refreshPageEmitter.emit();
      }, err => {
        console.log(err);
        this.loader = false;
      });
    }
  }

  delete(){
    const request = new DeleteUserRequest();
    request.userId = this.user.userId;

    this.userService.deleteUser(request).subscribe(response => {
      console.log(response);
      this.loader = false;
      this.router.navigateByUrl('/admin/users');
      this.notificationsService.showSuccess('User is deleted');
    }, err => {
      console.log(err);
      this.loader = false;
    });
  }
   
  uploadImage(event) {
    console.log(event)
    const request = new UploadImageRequest();
    request.profileImage = event.target.files[0];
    request.userId = this.user.userId;

    this.userService.uploadUserProfileImageAdminPanel(request).subscribe(response => {
      this.profileImageUrl = this.profileImageBaseUrl + '?userId=' + this.user.userId + '&random=' + Math.random();
      this.notificationsService.showSuccess('Image is updated');
        }, err => {
      });
  }

  deleteImage(event){
    console.log(event)
    const request = new DeleteImageRequest();
    request.userId = this.user.userId;
    this.registrationService.deleteProfileImage(request).subscribe(response => {
      this.profileImageUrl = this.profileImageBaseUrl + '?userId=' + this.user.userId  + '&random=' + Math.random();
      this.notificationsService.showSuccess('Image is deleted');
    }, err => {
    });
  }
   
  

}
