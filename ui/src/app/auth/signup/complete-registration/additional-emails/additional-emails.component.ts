import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UserModel } from '../user-model';
import { RegistrationService } from 'src/app/services/registration-service';
import { CompleteRegistrationRequest } from 'src/app/services/models/complete-registration-request';

@Component({
  selector: 'app-additional-emails',
  templateUrl: './additional-emails.component.html',
  styleUrls: ['./additional-emails.component.css']
})
export class AdditionalEmailsComponent implements OnInit {

  @Input() user: UserModel;
  @Input() current: number;
  @Output() currentEmitter: EventEmitter<number> = new EventEmitter<number>();
  
  newEmail: string = '';

  constructor(private registrationService: RegistrationService) { }

  ngOnInit(): void {
  }

  addAdditionalEmail() {
    this.user.additionalEmails.push(this.newEmail);
    this.newEmail = '';
  }

  removeAdditionalEmail(i) {
    this.user.additionalEmails.splice(i, 1);
  }

  onChangeArrayElement($event, i) {
    this.user.additionalEmails[i] = $event.target.value;
  }

  submit(): void {
    const request = new CompleteRegistrationRequest();

    request.username = this.user.username;
    request.firstname = this.user.firstname;
    request.lastname = this.user.lastname;
    request.additionalEmails = this.user.additionalEmails;
    request.address = this.user.address;
    request.birthDate = new Date(this.user.year['name'], this.user.month['id'], this.user.day['id']);
    request.city = this.user.city;
    request.country = this.user.country;
    request.gender = this.user.gender;
    request.postCode = this.user.postCode;
    
    this.registrationService.completeRegistration(request).subscribe(response => {
      console.log(response);
    }, err => {
      console.log(err);
    });
  }

  previous() {
    this.current--;
    this.currentEmitter.emit(this.current);
  }

}
