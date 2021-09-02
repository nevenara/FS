import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { noWhitespaceValidator } from 'src/app/shared/Validators/no-white-space-validator';
import { selectionValidator } from 'src/app/shared/Validators/selection-validator';

import { SearchCountryField, TooltipLabel, CountryISO } from 'ngx-intl-tel-input';
import { GetCountriesService } from 'src/app/services/get-countries-service';
import { OrganizerService } from 'src/app/admin/services/organizer-service';
import { AddOrganizerRequest } from 'src/app/admin/services/models/add-organizer-request';
import { Environment } from 'src/app/environments/environment';
import { NotificationsService } from 'src/app/notifications/services/notifications.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
  providers: [AddOrganizerRequest]
})
export class MainComponent implements OnInit {

  separateDialCode = false;
  SearchCountryField = SearchCountryField;
  TooltipLabel = TooltipLabel;
  CountryISO = CountryISO;
  preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];
  companyName;
  selectedCountry;
  loader: boolean = true;
  countries = [];
  loadingError;
  city;
  postcode;
  address;
  organizerUrl;
  selectedPhone;
  email;
  contactPerson;
  status = "Active";
  revenueSharing = 0;
  linkToLomnidoBridge;
  sellsAtFanSafe: boolean = false;
  allowsReturn: boolean = false;
  phoneValid: boolean;
  isEmpty: boolean;
  profileImage: File;
  url: string | ArrayBuffer;
  profileImageAPIUrl = Environment.serviceUrl + '/organizers/adminpanel/image';
  profileImageUrl;
  closeResult = '';
  form: FormGroup;
  isSubmit = false;
  constructor(private router: Router, private notificationsService: NotificationsService, private addOrganizerRequest: AddOrganizerRequest, private modalService: NgbModal, private formBuilder: FormBuilder, private getCountriesService: GetCountriesService, private getOrganizersService: OrganizerService) { }



  open3(content3) {
    this.modalService.open(content3, { centered: true });
  }

  ngOnInit(): void {
    this.profileImageUrl = this.profileImageAPIUrl;
    this.create()
    this.getCountries()
  }

  checkIsEmpty() {
    if (this.isEmpty != undefined) {
      if (this.selectedPhone == null) {
        this.isEmpty = true
      }
      else {
        this.isEmpty = false;
      }
    }
  }

  validatePhone() {
    if (this.selectedPhone == null) {
      this.isEmpty = true;
      return false;
    }
    else {
      this.isEmpty = false;
    }
  }

  getCountries() {
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

  create() {
    this.form = this.formBuilder.group({


      Companyname: ['', [Validators.required, noWhitespaceValidator]],
      Bridge: [],
      Revenue: [],
      Status: ['', selectionValidator],
      Contact: ['', [Validators.required, noWhitespaceValidator]],
      email  : ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
      URLl: ['', [Validators.required, noWhitespaceValidator]],
      Address: ['', [Validators.required, noWhitespaceValidator]],
      zipecode: ['', [Validators.required, noWhitespaceValidator]],
      City: ['', [Validators.required, noWhitespaceValidator]],
      Country: [null, [Validators.required, noWhitespaceValidator]],
      AllowsReturn: [],
      SellsAtFunsafe: [],




    });
  }
  get f() { return this.form.controls; }

  uploadImage(event) {
    this.profileImage = event.target.files[0];

    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);

    reader.onload = (_event) => {
      this.profileImageUrl = reader.result.toString();
    }
  }

  deleteImage() {
    this.profileImageUrl = this.profileImageAPIUrl;

  }

  emptyForm() {
    this.isSubmit = false;
    this.address = '';
    this.city = '';
    this.companyName = '';
    this.contactPerson = '';
    this.selectedCountry = null;
    this.email = '';
    this.sellsAtFanSafe = false;
    this.selectedPhone = null;
    this.linkToLomnidoBridge = '';
    this.postcode = '';
    this.status = 'Active';
    this.organizerUrl = '';
    this.allowsReturn = false;
    this.revenueSharing = 0;
    this.profileImage = null;
    this.profileImageUrl = this.profileImageAPIUrl;
  }


  addOrganizer() {
    if (this.validatePhone() == false) { this.phoneValid = false }
    else { this.phoneValid = true }
    this.isSubmit = true;
    if (this.form.invalid || this.phoneValid == false) { return; }

    this.addOrganizerRequest.address = this.address;
    this.addOrganizerRequest.city = this.city;
    this.addOrganizerRequest.companyName = this.companyName;
    this.addOrganizerRequest.contactPerson = this.contactPerson;
    this.addOrganizerRequest.country = this.selectedCountry.name;
    this.addOrganizerRequest.email = this.email;
    this.addOrganizerRequest.fansafeSale = this.sellsAtFanSafe;
    this.addOrganizerRequest.phone = this.selectedPhone.internationalNumber;
    this.addOrganizerRequest.linkLomnido = this.linkToLomnidoBridge;
    this.addOrganizerRequest.postCode = this.postcode;
    this.addOrganizerRequest.status = this.status;
    this.addOrganizerRequest.url = this.organizerUrl;
    this.addOrganizerRequest.ticketReturn = this.allowsReturn;
    this.addOrganizerRequest.revenueSharing = this.revenueSharing;
    this.addOrganizerRequest.image = this.profileImage;

    this.getOrganizersService.addOrganizer(this.addOrganizerRequest).subscribe(response => {
      this.notificationsService.showSuccess("Organizer added successfully!")
  
      this.loader = false;
      
      console.log(response);
      this.router.navigateByUrl('/admin/organizer')
    }, err => {
      console.log(err);
      this.loader = false;
      this.loadingError = true;
    })
  }
}
