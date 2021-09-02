import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { noWhitespaceValidator } from 'src/app/shared/Validators/no-white-space-validator';
import { ConnectNewAccountRequest } from '../../../../services/models/connect-new-account-request';
import { LinkedAccount } from '../../models/linked-account';
import { Environment } from 'src/app/environments/environment';
import { GetCountriesService } from '../../../../services/get-countries-service'
import { NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { QrService } from 'src/app/services/qr-service';
import { TranslateService } from '@ngx-translate/core';
import { LocalisationService } from 'src/app/localisation/services/localisation.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit, OnDestroy {

  @Output() connectNewAccountEmitter: EventEmitter<ConnectNewAccountRequest> = new EventEmitter<ConnectNewAccountRequest>();

  relation: Array<any>;
  
  countries = [];
  selectedCountry;
  @Input() model: NgbDateStruct;
  pdate: { year: number, month: number };
  date;
  dateformat;
  datemodel: { day, month, year }
  emptyDate: boolean = false;
  dateValidation: boolean = true;
  currentDate = new Date();
  minDate = { year: 1920, month: 1, day: 1 }
  maxDate = { year: this.currentDate.getFullYear(), month: this.currentDate.getMonth() + 1, day: this.currentDate.getDay() - 1 }
  form: FormGroup;
  @Input() isSubmit = false;
  linkedAccount: LinkedAccount = new LinkedAccount();
  @Input() request: ConnectNewAccountRequest = new ConnectNewAccountRequest();

  profileImage: any;
  url: string | ArrayBuffer;

  profileImageAPIUrl = Environment.serviceUrl + '/getdefaultprofileimage';
  profileImageUrl;

  changeLanguageSubscription: Subscription;

  filterTranslationKeys = [
    'relationToMainAccount.grandfather',
    'relationToMainAccount.grandmother',
    'relationToMainAccount.father',
    'relationToMainAccount.mother',
    'relationToMainAccount.husband',
    'relationToMainAccount.wife',
    'relationToMainAccount.partner',
    'relationToMainAccount.child',
    'relationToMainAccount.brother',
    'relationToMainAccount.sister',
    'relationToMainAccount.uncle',
    'relationToMainAccount.aunt'
]

  constructor(
    private getCountriesService: GetCountriesService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private qrService: QrService,
    private ngbDateParserFormatter: NgbDateParserFormatter,
    public translate: TranslateService,
    private localisationService: LocalisationService
  ) { 
    
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(data => {
      let uuid = this.activatedRoute.snapshot.queryParamMap.get("uuid");
      this.create();
      this.setLanguage();
      this.changeLanguageSubscription = this.localisationService.changeLanguage$.subscribe(() => {
          this.setLanguage();
      })

      if (uuid) {
        this.qrService.getUrlParams(uuid).subscribe(response => {
          let userHash = response.urlParams;
          this.request = JSON.parse(atob((userHash)));

          this.linkedAccount.username = this.request.username;
          this.linkedAccount.firstname = this.request.firstname;
          this.linkedAccount.lastname = this.request.lastname;
          this.linkedAccount.relation = this.request.relationToMainAccountObj;
          this.linkedAccount.address = this.request.address;
          console.log(this.request.birthDate);
          this.model = {
            day: new Date(this.request.birthDate).getDate(),
            month: new Date(this.request.birthDate).getMonth() + 1,
            year: new Date(this.request.birthDate).getFullYear()
          };
          this.setDate();
          this.linkedAccount.city = this.request.city;
          this.selectedCountry = this.request.country;
          this.linkedAccount.gender = this.request.gender;
          this.linkedAccount.postCode = this.request.postCode;
          this.profileImageUrl = this.request.profileImage || this.profileImageAPIUrl;
          this.profileImage = this.request.profileImage;

          this.getCountries();
          this.setLanguage();
        })
      } else {
        this.profileImageUrl = this.profileImageAPIUrl;
        this.linkedAccount.gender = 2;

        this.getCountries();
      }


    });
  }

  ngOnDestroy() {
    this.changeLanguageSubscription.unsubscribe();
  }

  setLanguage() {
    this.relation = [
        { item_id: 1, item_text: 'Grandfather'},
        { item_id: 2, item_text: 'Grandmother' },
        { item_id: 3, item_text: 'Father' },
        { item_id: 4, item_text: 'Mother' },
        { item_id: 5, item_text: 'Husband'},
        { item_id: 6, item_text: 'Wife'},
        { item_id: 7, item_text: 'Partner' },
        { item_id: 8, item_text: 'Child' },
        { item_id: 9, item_text: 'Brother' },
        { item_id: 10, item_text: 'Sister' },
        { item_id: 11, item_text: 'Uncle' },
        { item_id: 12, item_text: 'Aunt' }
    ];

    for (let i = 0; i < this.filterTranslationKeys.length; i++) {
        this.translate.get(this.filterTranslationKeys[i]).subscribe((data:any)=> {
            if (this.linkedAccount.relation && this.linkedAccount.relation.item_id == this.relation[i].item_id) {
                this.linkedAccount.relation = null;
                this.linkedAccount.relation = {item_id: this.relation[i].item_id, item_text: data};
            }
            this.relation[i].item_text = data;
        });
    }
  }

  setDefaultDate(): NgbDateStruct {
    var startDate = new Date();
    let startYear = startDate.getFullYear();
    let startMonth = startDate.getMonth() + 1; 
    let startDay = 1;

    return this.ngbDateParserFormatter.parse(startYear + "." + startMonth + "." + startDay);
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
    this.validateDate();
  }

  validateDate() {
    if (this.model == undefined) {
      this.emptyDate = true;
      return false;
    }
    else {
      this.emptyDate = false;
    }
  }

  create() {
    this.form = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength, noWhitespaceValidator]],
      gender: ['male', Validators.required],
      firstName: ['', [Validators.required, noWhitespaceValidator]],
      lastName: ['', [Validators.required, noWhitespaceValidator]],
      address: ['', [Validators.required, noWhitespaceValidator]],
      zipCode: ['', [Validators.required, noWhitespaceValidator]],
      city: ['', [Validators.required, noWhitespaceValidator]],
      country: [null, Validators.required],
      relation: [null, Validators.required],
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

  getCountries() {
    this.countries = []
    this.getCountriesService.getCountryList().subscribe(response => {
      this.countries = response;
    }, err => {
      console.log(err);
    })
  }

  connectNewAccount() {
    console.log(this.model)
    this.isSubmit = true;
    if (this.validateDate() == false) { return; }
    if (this.form.invalid) { return; }

    this.request = new ConnectNewAccountRequest();

    this.request.username = this.linkedAccount.username;
    this.request.firstname = this.linkedAccount.firstname;
    this.request.lastname = this.linkedAccount.lastname;
    this.request.relationToMainAccountObj = this.linkedAccount.relation;
    this.request.address = this.linkedAccount.address;
    this.request.birthDate = new Date(this.date);
    this.request.city = this.linkedAccount.city;
    this.request.country = this.selectedCountry.name;
    this.request.gender = this.linkedAccount.gender;
    this.request.postCode = this.linkedAccount.postCode;

    if (this.profileImage) {
      this.request.profileImage = this.profileImage;
    }

    this.connectNewAccountEmitter.next(this.request);
  }

}
