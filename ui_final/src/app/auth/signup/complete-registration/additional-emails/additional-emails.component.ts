import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NotificationsService } from 'src/app/notifications/services/notifications.service';
import { CompleteRegistrationRequest } from 'src/app/services/models/complete-registration-request';
import { CountryModel } from 'src/app/services/models/country-model';
import { RegistrationService } from 'src/app/services/registration-service';
import { UserModel } from '../user-model';

@Component({
  selector: 'app-additional-emails',
  templateUrl: './additional-emails.component.html',
  styleUrls: ['./additional-emails.component.css']
})
export class AdditionalEmailsComponent implements OnInit {

  isSubmit = false;
  form: FormGroup;
  emails = [];
  newEmail: string = '';
  loader = false;

  @Input() user: UserModel;
  @Input() current: number;
  @Output() currentEmitter: EventEmitter<number> = new EventEmitter<number>();
  
  constructor(private formBuilder: FormBuilder, private router:Router, private registrationService: RegistrationService, private notificationsService: NotificationsService, private translate: TranslateService) { }

  ngOnInit(): void {
    this.create();
  }
  create() {
    this.form = this.formBuilder.group({newEmail: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]]});
  }
  get f() {return this.form.controls; }

  addAdditionalEmail() {
    this.isSubmit = true;
    if(this.form.invalid) {return; }

    this.user.additionalEmails.push(this.newEmail);
    this.isSubmit = false;
    this.newEmail = '';
  }

  removeAdditionalEmail(i) {
    this.user.additionalEmails.splice(i, 1);
  }

  onChangeArrayElement($event, i) {
    this.user.additionalEmails[i] = $event.target.value;
  }

  submit(): void {
    this.loader = true;
    const request = new CompleteRegistrationRequest();

    request.username = this.user.username;
    request.firstname = this.user.firstname;
    request.lastname = this.user.lastname;
    request.additionalEmails = this.user.additionalEmails;
    request.address = this.user.address;
    console.log(this.user.date + "this is user date")
    request.birthDate = new Date(this.user.date);
    console.log(request.birthDate)
    request.city = this.user.city;
    request.country = this.user.country.name;
    request.gender = this.user.gender;
    request.postCode = this.user.postCode;
    request.phone = this.user.phone.e164Number;
    
    this.registrationService.completeRegistration(request).subscribe(response => {
      console.log(response);
      this.form.reset();
      this.isSubmit = false;
      this.loader = false;
      this.translate.get('notifications.auth.registrationCompleted').subscribe((data:any)=> {
        this.notificationsService.showSuccess(data);
      });
      this.router.navigate(['/home']);
    }, err => {
      console.log(err);
      this.loader = false;
    });
  }

  previous() {
    this.current--;
    this.currentEmitter.emit(this.current);
  }
  
}
