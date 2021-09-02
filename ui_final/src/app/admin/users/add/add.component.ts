import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { noWhitespaceValidator } from 'src/app/shared/Validators/no-white-space-validator';
import { AddUserAdminPanelRequest } from '../../services/models/add-user-request'
import { SearchCountryField, TooltipLabel, CountryISO } from 'ngx-intl-tel-input';
import { GetCountriesService } from 'src/app/services/get-countries-service';
import { UserService } from '../../services/user-service';
import { NotificationsService } from 'src/app/notifications/services/notifications.service';
import { Environment } from 'src/app/environments/environment';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css'],
  providers: [AddUserAdminPanelRequest]
})
export class AddComponent implements OnInit {


  separateDialCode = false;
  SearchCountryField = SearchCountryField;
  TooltipLabel = TooltipLabel;
  CountryISO = CountryISO;
  preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];
  countries = [];
  date;
  loader = true;
  loadingError;
  dateformat;
  username;
  firstName;
  lastName;
  address;
  postcode;
  city;
  selectedPhone;
  standardEmail;
  phoneValid: boolean;
  dateValid: boolean;
  isEmpty: boolean;
  linkedToMain;
  datemodel: { day, month, year }
  model: NgbDateStruct;
  isMainAccount: boolean = true;
  emptyDate: boolean = false;
  dateValidation: boolean = true;
  currentDate = new Date();
  minDate = { year: 1920, month: 1, day: 1 }
  maxDate = { year: this.currentDate.getFullYear(), month: this.currentDate.getMonth() + 1, day: this.currentDate.getDay() - 1 }
  selectedCountry;
  genderSelected = 2;
  profileImage: File;
  url: string | ArrayBuffer;

  profileImageAPIUrl = Environment.serviceUrl + '/getdefaultprofileimage';
  profileImageUrl;

  relation = [
    'Brother', 'Sister', 'Friend'
  ];


  form: FormGroup;
  formEmail: FormGroup;
  formLinked: FormGroup;
  isSubmit = false;
  standerdEmailShow: boolean = true;

  birthDate;

  constructor(private userService: UserService, private cdr: ChangeDetectorRef, private getCountriesService: GetCountriesService, private formBuilder: FormBuilder, private addUserAdminPanelRequest: AddUserAdminPanelRequest, private notificationsService: NotificationsService) { }

  ngOnInit(): void {
    this.profileImageUrl = this.profileImageAPIUrl;
    this.create()
    this.getCountries();
  }

  setDate() {
    this.datemodel = { day: this.model.day, month: this.model.month, year: this.model.year }
    if (this.datemodel.day < 10) {
      this.datemodel.day = "0" + this.datemodel.day;
    }
    console.log(this.datemodel.day)
    if (this.datemodel.month < 10) {
      this.datemodel.month = "0" + this.datemodel.month;
    }
    this.date = this.datemodel.month.toString() + '/' + this.datemodel.day.toString() + '/' + this.datemodel.year.toString()
    this.birthDate = new Date(this.date)
    this.validateDate();
  }

  validateDate() {
    console.log(this.model)
    if (this.model == undefined) {
      this.emptyDate = true;
      return false;
    }
    else {
      this.emptyDate = false;
    }
  }

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
    this.profileImage = null;
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

  checkIsEmpty() {
    if (this.isSubmit && this.isEmpty != undefined) {
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

  create() {
    this.form = this.formBuilder.group({


      Username: ['', [Validators.required, Validators.minLength, noWhitespaceValidator]],
      Firstname: ['', [Validators.required, noWhitespaceValidator]],
      Lastname: ['', [Validators.required, noWhitespaceValidator]],
      Address: ['', [Validators.required, noWhitespaceValidator]],
      zipecode: ['', [Validators.required, noWhitespaceValidator]],
      City: ['', [Validators.required, noWhitespaceValidator]],
      Country: [null, Validators.required]
    });

    this.formEmail = this.formBuilder.group({
      Email: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]]
    });

    this.formLinked = this.formBuilder.group({
      LinkedToMain: ['', [Validators.required]]
    });
  }
  get f() { return this.form.controls; }
  get fe() { return this.formEmail.controls; }
  get fl() { return this.formLinked.controls; }

  IsMainCheck() {
    this.isMainAccount = !this.isMainAccount
    if (!this.standerdEmailShow) {
      this.standerdEmailShow = true
    }
    else {
      this.standerdEmailShow = false
    }
  }

  emptyData() {
    this.isSubmit = false;
    this.isMainAccount = true;
    this.genderSelected = 2;
    this.address = '';
    this.username = '';
    this.firstName = '';
    this.lastName = '';
    this.city = '';
    this.selectedCountry = null;
    this.selectedPhone = null;
    this.postcode = '';
    this.standardEmail = '';
    this.linkedToMain = '';
    this.profileImage = null;
    this.profileImageUrl = this.profileImageAPIUrl;
    this.loader = false;
    this.phoneValid = true;
    this.dateValid = true;
    this.model = null;
    this.isEmpty = false;
  }

  addUser() {
    this.isSubmit = true;
    this.checkIsEmpty();

    if (this.validatePhone() == false) { this.phoneValid = false }
    else { this.phoneValid = true }
    if (this.validateDate() == false) { this.dateValid = false }
    else { this.dateValid = true }
    if (this.form.invalid || this.dateValid == false || this.phoneValid == false) { return; }

    if (this.form.invalid) { return; }
    if (this.isMainAccount && this.formEmail.invalid) { return; }
    if (!this.isMainAccount && this.formLinked.invalid) { return; }
    if (this.isEmpty) { return; }

    this.isSubmit = false;
    this.loader = true;
    this.addUserAdminPanelRequest = new AddUserAdminPanelRequest();
    this.addUserAdminPanelRequest.isMainAccount = this.isMainAccount
    this.addUserAdminPanelRequest.gender = this.genderSelected;
    this.addUserAdminPanelRequest.username = this.username;
    this.addUserAdminPanelRequest.firstname = this.firstName;
    this.addUserAdminPanelRequest.lastname = this.lastName;
    this.addUserAdminPanelRequest.city = this.city;
    this.addUserAdminPanelRequest.address = this.address;
    this.addUserAdminPanelRequest.country = this.selectedCountry.name;
    this.addUserAdminPanelRequest.phone = this.selectedPhone.internationalNumber;
    this.addUserAdminPanelRequest.postCode = this.postcode;
    this.addUserAdminPanelRequest.standardEmail = this.standardEmail;
    this.addUserAdminPanelRequest.profileImage = this.profileImage;
    this.addUserAdminPanelRequest.birthDate = this.birthDate;

    if (!this.isMainAccount) {
      this.addUserAdminPanelRequest.linkedToMainAccount = this.linkedToMain;
    }
    

    this.userService.addUser(this.addUserAdminPanelRequest).subscribe(response => {
      this.notificationsService.showSuccess("User added successfully!")
      this.emptyData();
    }, err => {
      this.loader = false;
    })
  }
}
