import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CountryISO, SearchCountryField, TooltipLabel } from 'ngx-intl-tel-input';
import { ActivatedRoute, Router } from '@angular/router';
import { OrganizerService } from 'src/app/admin/services/organizer-service';
import { GetOrganizersMainDataRequest } from '../../../services/models/get-organizers-main-data-request'
import { OrganizerMainDataPreview } from '../../../models/ogranizer-main-data-preview'
import { Environment } from 'src/app/environments/environment';
import { GetCountriesService } from 'src/app/services/get-countries-service';
import { DeleteOrganizerRequest } from 'src/app/admin/services/models/delete-organizer-reuqest';
import { UpdateOrganizerRequest } from 'src/app/admin/services/models/update-organizer-request';
import { NotificationsService } from 'src/app/notifications/services/notifications.service';
import { UploadOrganizerPlaceholderImageRequest } from 'src/app/admin/services/models/upload-organizer-placeholder-image-request';
import { DeleteProfileImageRequest } from 'src/app/services/models/delete-profile-image-request';
import { DeleteOrganizerImageRequest } from 'src/app/admin/services/models/delete-organizer-image-request';
import { PasswordRecoveryInitRequest } from 'src/app/services/models/password-recovery-init-request';
import { GetOrganizersAccountSettingRequest } from 'src/app/admin/services/models/get-organizer-account-settings-request';
import { UserType } from 'src/app/services/models/user-context';
import { AuthenticationService } from 'src/app/services/authentication-service';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
  providers: [OrganizerMainDataPreview, UpdateOrganizerRequest ]
})
export class MainComponent implements OnInit {

  separateDialCode = false;
	SearchCountryField = SearchCountryField;
	TooltipLabel = TooltipLabel;
	CountryISO = CountryISO;
	preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];
  organizerId;
  organizers: OrganizerMainDataPreview;
  organizerImage: File;
  url: string | ArrayBuffer;
  organizerImageAPIUrl = Environment.serviceUrl + '/organizers/adminpanel/image';
  organizerImageUrl;
  loader: boolean = true;
  loadingError;
  phoneValid: boolean;
  isEmpty: boolean;
  selectedPhone;
  selectedCountry;
  city;
  postcode;
  address;
  organizerUrl;

  email;
  contactPerson;
  status;
  revenueSharing = 0;
  linkToLomnidoBridge;
  sellsAtFanSafe: boolean;
  allowsReturn: boolean;
  organizerAccount: any = {companyName:"", email:""}


  countries = [
  ];
  
  closeResult = '';
  form: FormGroup;
  isSubmit = false;

  userType: UserType;

  constructor(private notificationsService: NotificationsService, private authService: AuthenticationService, private updateOrganizerRequest: UpdateOrganizerRequest, private route: ActivatedRoute, private getCountriesService: GetCountriesService, private router: Router, private modalService: NgbModal,private formBuilder:FormBuilder, private organizerService: OrganizerService) { }



  open3(content3) {
    this.modalService.open(content3, { centered: true });
  }


  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.organizerId = params['organizer.id'];
   })
   this.getCountries()
    this.create()
    this.organizerId = this.route.snapshot.paramMap.get('organizerId');
    this.organizerImageUrl = this.organizerImageAPIUrl + '?organizerId=' + this.organizerId + '&random=' + Math.random();

    this.getUserType();
    this.getOrganizersAccount()
    this.getOrganizers()
  }

  getUserType() {
    this.authService.getUserType().subscribe(response => {
      this.userType = response.userType;
    })
  }
  
  getCountries(){
    this.loader = true;
    this.countries = []
    this.getCountriesService.getCountryList().subscribe(response => {
      this.countries = response;
      this.loader = false;
    }, err => {
      console.log(err);
      this.loader = false;
      this.loadingError = true;
    })
  }

  create() {
    this.form = this.formBuilder.group({
      Revenue: [],
      Bridge: [],
      Status: ['', Validators.required],
      Contact: ['', Validators.required],
      Email  : ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
      URLl: ['', Validators.required],
      Address: ['', Validators.required],
      zipcode: ['', Validators.required],
      City: ['', Validators.required],
      Country: [null, Validators.required],
    });

  }

  get f() { return this.form.controls; }

  checkIsEmpty() {
    if (this.isEmpty != undefined) {
      if (this.organizers.phone == null) {
        this.isEmpty = true
      }
      else {
        this.isEmpty = false;
      }
    }
  }

  validatePhone() {
    if (this.organizers.phone == null) {
      this.isEmpty = true;
      return false;
    }
    else {
      this.isEmpty = false;
    }
  }
  
  uploadImage(event) {
    this.organizerImage = event.target.files[0];

    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);

    reader.onload = (_event) => {
      this.organizerImageUrl = reader.result.toString();
    }
    const request = new UploadOrganizerPlaceholderImageRequest();
    request.image = event.target.files[0];
    request.organizerId = this.organizerId;
    console.log(request.image)
    this.organizerService.uploadOrganizerImage(request).subscribe(response => {
      this.loader=false;
      this.organizerImageUrl = this.organizerImageAPIUrl + '?organizerId=' + this.organizerId + '&random=' + Math.random();

      }, err => {
    });
  }

  deleteImage() {
    const request = new DeleteOrganizerImageRequest;
    request.organizerId = this.organizerId;
    this.organizerImageUrl = this.organizerImageAPIUrl;
    this.organizerService.deleteOrganizerImage(request).subscribe(response => {

    })
  }

  getOrganizers(){

    let request = new GetOrganizersMainDataRequest;
    request.organizerId = this.organizerId;
    this.organizerService.getOrganizerMainData(request).subscribe(response => {
      this.organizers = response;
      console.log(response)
      this.revenueSharing = this.organizers.revenueSharing
   }, err => {
    console.log(err);
    this.loader = false;
    this.loadingError = true;
  })
  }

  validatePrice(event: any) {
        
    if(!this.revenueSharing){
        this.revenueSharing = +this.revenueSharing
    }
    var regex = new RegExp("^[0-9][0-9]*[.,,]?[0-9]{0,1}$");
    if (event.keyCode != "8" || !this.revenueSharing) {
        if (!this.revenueSharing.toString().match(regex)){
            event.preventDefault();
        }
    }
}

roundPrice(){
    if(!this.revenueSharing){
        this.revenueSharing = 0
    }
    console.log(this.revenueSharing + "isPrice")
    var regexLeadingZero = new RegExp("^(0[0-9]+|0)")
    if(this.revenueSharing.toString().match(regexLeadingZero)){
        console.log("isLeadingZero")
        this.revenueSharing = +this.revenueSharing
    }
}

  deleteOrganizer(){

    let request = new DeleteOrganizerRequest;
    request.organizerId = this.organizerId;
    this.organizerService.deleteOrganizer(request).subscribe(response => {
      console.log(response)
   }, err => {
      console.log(err);
      this.loader = false;
      this.loadingError = true;
    })
  }

  updateOrganizer(){
    
    if (this.validatePhone() == false) { this.phoneValid = false }
    else { this.phoneValid = true }
    this.isSubmit = true;
    console.log(this.phoneValid)
    if (this.form.invalid || this.phoneValid == false) { return; }

    console.log(this.organizers.phone)
    this.updateOrganizerRequest.organizerId = this.organizerId;
    this.updateOrganizerRequest.address = this.organizers.address;
    this.updateOrganizerRequest.city = this.organizers.city;
    this.updateOrganizerRequest.contactPerson = this.organizers.contactPerson;
    this.updateOrganizerRequest.country = this.organizers.country.name;
    this.updateOrganizerRequest.email = this.organizers.email;
    this.updateOrganizerRequest.fansafeSale = this.organizers.fansafeSale;
    this.updateOrganizerRequest.phone = this.organizers.phone.internationalNumber;
    this.updateOrganizerRequest.linkToLomnidoBridge = this.organizers.linkToLomnidoBridge;
    this.updateOrganizerRequest.postCode = this.organizers.postCode;
    this.updateOrganizerRequest.status = this.organizers.status;
    this.updateOrganizerRequest.url = this.organizers.url;
    this.updateOrganizerRequest.ticketReturn = this.organizers.ticketReturn;
    this.updateOrganizerRequest.revenueSharing = this.revenueSharing;

    this.organizerService.updateOrganizer(this.updateOrganizerRequest).subscribe(response => {
      this.notificationsService.showSuccess("Organizer updated successfully!")

      this.loader = false;
      console.log(response);
    }, err => {
      console.log(err);
      this.loader = false;
      this.loadingError = true;
    })
  }


  passwordRecovery(){
    let request = new PasswordRecoveryInitRequest();
    //request.email = this.organizerService
    request.email = this.organizers.email;
    console.log({email: request})
    this.organizerService.passwordRecovery(request).subscribe(response => {
      this.notificationsService.showSuccess("Password reset sent successfully! Check your email.")
     console.log(response)
   }, err => {
    console.log(err);
  })
  }

  getOrganizersAccount(){

    let request = new GetOrganizersAccountSettingRequest();
    request.organizerId = this.organizerId;
    this.organizerService.getOrganizersAccountSettings(request).subscribe(response => {
      this.organizerAccount = response;
      console.log(response)
   }, err => {
    console.log(err);
  })
  }
  
}
