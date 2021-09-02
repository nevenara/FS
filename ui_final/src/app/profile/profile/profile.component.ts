import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { CountryISO, SearchCountryField, TooltipLabel } from 'ngx-intl-tel-input';
import { noWhitespaceValidator } from 'src/app/shared/Validators/no-white-space-validator';
import { UpdateUserProfileRequest } from 'src/app/services/models/update-user-profile-request';
import { UserProfileService } from 'src/app/services/user-profile-service';
import { UserProfileData } from './models/user-profile-data';
import { UploadProfileImageRequest } from 'src/app/services/models/upload-profile-image-request';
import { RegistrationService } from 'src/app/services/registration-service';
import { AdditionalEmailsService } from 'src/app/services/additional-emails-service';
import { Environment } from 'src/app/environments/environment';
import { NotificationsService } from 'src/app/notifications/services/notifications.service';
import { GetCountriesService } from 'src/app/services/get-countries-service';
import { AddAdditionalEmailRequest } from 'src/app/services/models/add-additional-email-request';
import { UpdateHeaderProfileImageService } from '../../layout/header/services/update-header-profile-image.service';
import { DeleteProfileImageRequest } from  '../../services/models/delete-profile-image-request'
import { DateFormatter } from 'src/app/shared/date-formatter';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  separateDialCode = false;
	SearchCountryField = SearchCountryField;
	TooltipLabel = TooltipLabel;
	CountryISO = CountryISO;
	preferredCountries: CountryISO[] = [CountryISO.Austria];
  isEmpty: boolean;

  closeResult = '';
  form: FormGroup;
  formAdditionalEmails: FormGroup;
  isSubmit = false;
  isSubmitAdditionalEmails = false;
  user: UserProfileData = new UserProfileData();
  newEmail: string = '';
  newStandardEmail: string = '';
  dateFormatter: DateFormatter = new DateFormatter();

  profileImageBaseUrl;
  profileImageUrl = '';

  countries = [];

  loader = true;
  loadError = false;
  
  constructor(
    private modalService: NgbModal, 
    private formBuilder: FormBuilder, 
    private userProfileService: UserProfileService,
    private registrationService: RegistrationService,
    private additionalEmailsService: AdditionalEmailsService,
    private notificationsService: NotificationsService,
    private getCountriesService: GetCountriesService,
    private updateHeaderProfileImageService: UpdateHeaderProfileImageService,
    public translate: TranslateService

  ) { }

  open(content) {
    this.modalService.open(content,  { centered: true }).result.then((result) => {
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
  checkIsEmpty(){
    if(this.isEmpty != undefined){
      if(this.user.phone == null){
        this.isEmpty = true
      }
      else{
        this.isEmpty = false;
      }
    }
  }
  ngOnInit(): void {
    this.create();
    this.getCountries();
    this.getUserProfile();
  }

  getUserProfile() {
    this.loader = true;
    this.userProfileService.getUserProfile().subscribe(response => {
      this.loader = false;
      this.user = response;
      this.profileImageBaseUrl = Environment.serviceUrl + '/users/profileimage?userId=' + this.user.userId;
      this.profileImageUrl = this.profileImageBaseUrl;
      this.user.gender === "1" ? this.user.gender = "female" : this.user.gender = "male" ;
    }, err => {
      console.log(err);
      this.loadError = true;
      this.loader = false;
    });
  }

  create() {
    this.form = this.formBuilder.group({
     
      address: ['',  [ noWhitespaceValidator ]],
      zipCode: ['', [noWhitespaceValidator ]],
      city: ['',  [noWhitespaceValidator ]],
      country: [null, [Validators.required]],
    });

    this.formAdditionalEmails = this.formBuilder.group({
      newEmail: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
    });
  }
  
  get f() { return this.form.controls; }
  get fa() { return this.formAdditionalEmails.controls; }

 
  updateUserProfile(){
    if(this.isEmpty == undefined){
      if(this.user.phone == null){
        this.isEmpty = true
      }
      else{
        this.isEmpty = false
      }
    }
    else{
      if(this.user.phone == null){
        this.isEmpty = true
      }
      else{
        this.isEmpty = false
      }
    }
    this.isSubmit = true;
    if (this.form.invalid) { return; }

    if(this.user.phone != null){
    let request = new UpdateUserProfileRequest();
    request.address = this.user.address;
    request.city = this.user.city;
    request.country = this.user.country;
    if(this.user.phone != undefined){
    request.phone = this.user.phone.e164Number;
  }
    request.postCode = this.user.postCode;

    this.userProfileService.updateUserProfile(request).subscribe(response => {
      console.log(response);

      
      this.translate.get('notifications.profile.profileUpdated').subscribe((data:any)=> {
        this.notificationsService.showSuccess(data);
       });
      
    }, err=> {
    })
  }
  }

  addAdditionalEmail(){
    this.isSubmitAdditionalEmails = true;
    if (this.formAdditionalEmails.invalid) { return; }

    let request: AddAdditionalEmailRequest = new AddAdditionalEmailRequest();
    request.email = this.newEmail;

    this.additionalEmailsService.addAdditionalEmail(request).subscribe(response => {
      
      this.user.additionalEmails.push(response);
      this.newEmail = '';
      this.isSubmitAdditionalEmails = false;

      this.translate.get('notifications.profile.additionalEmailAdded').subscribe((data:any)=> {
        this.notificationsService.showSuccess(data);
      });
    }, err => {
    })
  }

  uploadImage(event) {
    console.log(event)
    const request = new UploadProfileImageRequest();
    request.profileImage = event.target.files[0];
    this.registrationService.uploadProfileImage(request).subscribe(response => {
      this.updateHeaderProfileImageService.updateHeaderProfileImage();
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
    this.registrationService.deleteProfileImage(request).subscribe(response => {
      this.updateHeaderProfileImageService.updateHeaderProfileImage();
      this.profileImageUrl = this.profileImageBaseUrl + '&random=' + Math.random();
      this.translate.get('notifications.profile.profileImageDeleted').subscribe((data:any)=> {
        this.notificationsService.showSuccess(data);
      });
    }, err => {
    });
  }

  setStandardEmail(email){
    this.newStandardEmail = email;
  }

  useAsStandardEmail(password){
    this.additionalEmailsService.useAsStandardEmail({email: this.newStandardEmail, password: password}).subscribe(response => {
      this.getUserProfile();
      this.translate.get('notifications.profile.standardEmailUpdated').subscribe((data:any)=> {
        this.notificationsService.showSuccess(data);
      });
    }, err => {
    })
  }

  deleteAdditionalEmail(email){
    this.additionalEmailsService.deleteAdditionalEmail({email: email}).subscribe(response => {
      const index = this.user.additionalEmails.findIndex(x => x['email'] === email);
      if (index > -1) {
        this.user.additionalEmails.splice(index, 1);
      }
      this.translate.get('notifications.profile.additionalEmailDeleted').subscribe((data:any)=> {
        this.notificationsService.showSuccess(data);
      });
    }, err => {
    })
  }

  getCountries(){
    this.countries = []
    this.getCountriesService.getCountryList().subscribe(response => {
     this.countries = response;
    }, err => {
      console.log(err);
      this.loadError = true;
    })
  }

}
