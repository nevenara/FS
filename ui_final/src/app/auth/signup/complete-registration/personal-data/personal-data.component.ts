import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CountryISO, SearchCountryField, TooltipLabel } from 'ngx-intl-tel-input';
import { noWhitespaceValidator } from './../../../../shared/Validators/no-white-space-validator';
import { UserModel } from '../user-model';
import { IDateRangePickerOptions } from 'ngx-daterange';
import * as moment from 'moment';
import { GetCountriesService } from 'src/app/services/get-countries-service';
import { CountryModel } from '../../../../services/models/country-model'
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-personal-data',
  templateUrl: './personal-data.component.html',
  styleUrls: ['./personal-data.component.css']
})
export class PersonalDataComponent implements OnInit {
  @Input() user: UserModel;
  @Input() current: number;
  @Output() currentEmitter: EventEmitter<number> = new EventEmitter<number>();

  separateDialCode = false;
  SearchCountryField = SearchCountryField;
  TooltipLabel = TooltipLabel;
  datemodel: { day, month, year }
  phoneValid: boolean;
  dateValid: boolean;
  CountryISO = CountryISO;
  preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];
  date;
  isEmpty: boolean;
  emptyDate: boolean = false;
  currentDate = new Date();
  minDate = { year: 1920, month: 1, day: 1 }
  maxDate = { year: this.currentDate.getFullYear(), month: this.currentDate.getMonth() + 1, day: this.currentDate.getDay() - 1 }

  countries = [
  ];


  setDate() {
    this.datemodel = { day: this.user.birthDate.day, month: this.user.birthDate.month, year: this.user.birthDate.year }
    console.log(this.datemodel)
    if (this.datemodel.day < 10) {
      this.datemodel.day = "0" + this.datemodel.day;
    }
    console.log(this.datemodel.day)
    if (this.datemodel.month < 10) {
      this.datemodel.month = "0" + this.datemodel.month;
    }
    this.date = this.datemodel.month.toString() + '/' + this.datemodel.day.toString() + '/' + this.datemodel.year.toString()
    console.log(this.date)
    this.validateDate();
  }

  validateDate() {
    if (this.user.birthDate == undefined) {
          this.emptyDate = true;
          return false;
        }
        else {
          this.emptyDate = false;
          this.user.date = this.date;
          console.log("current date is " + this.user.date)
        }
        if(this.user.date == undefined){
          this.setDate();
        }
  //   if(!this.user.date){
  //   console.log(this.user.birthDate)
  //   if (this.user.birthDate == undefined) {
  //     this.emptyDate = true;
  //     return false;
  //   }
  //   else {
  //     this.emptyDate = false;
  //     this.user.date = this.date;
  //     this.user.birthDate = this.date;
  //     console.log("current date is " + this.user.date)
  //   }
  // }
  // console.log("current date is " + this.user.date)

  }

  gender = [
    { id: 1, name: 'Female' }, { id: 2, name: 'Male' }
  ];
  form: FormGroup;
  isSubmit = false;
  constructor(private formBuilder: FormBuilder, private router: Router, private getCountriesService: GetCountriesService, private translate: TranslateService) { }

  ngOnInit(): void {
    this.user.gender = 2;
    this.create();
    this.getCountries();
  }

  create() {
    this.form = this.formBuilder.group({
      gender: ['male', Validators.required],
      firstName: ['', [Validators.required, noWhitespaceValidator]],
      lastName: ['', [Validators.required, noWhitespaceValidator]],
      address: ['', [Validators.required, noWhitespaceValidator]],
      zipCode: ['', [Validators.required, noWhitespaceValidator]],
      city: ['', [Validators.required, noWhitespaceValidator]],
      country: [null, Validators.required],
    });

  }

  logChange() {
    console.log(this.user.phone)
  }

  checkIsEmpty() {
    if (this.isEmpty != undefined) {
      if (this.user.phone == null) {
        this.isEmpty = true
      }
      else {
        this.isEmpty = false;
      }
    }
  }

  validatePhone() {
    if(this.user.phone == null){
      this.isEmpty = true;
      return false;
    }
    else{
      this.isEmpty = false;
    }
  }

  get f() { return this.form.controls; }

  next() {
    if (this.validatePhone() == false) { this.phoneValid = false }
    else{this.phoneValid = true}
    this.isSubmit = true;
    if (this.validateDate() == false) { this.dateValid = false }
    else{this.dateValid = true}

    if (this.form.invalid || this.dateValid == false || this.phoneValid == false) { return; }
    console.log("editedDate")
    console.log(this.user.date)
    // this.user.country = this.selectedCountry.name;
    this.current++
    this.currentEmitter.emit(this.current);
  }

  previous() {
    this.current--;
    this.currentEmitter.emit(this.current);
  }
  getCountries() {
    this.countries = []
    this.getCountriesService.getCountryList().subscribe(response => {
      this.countries = response;
    }, err => {
      console.log(err);
    })
  }

}
