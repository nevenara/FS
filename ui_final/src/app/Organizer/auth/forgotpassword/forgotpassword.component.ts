import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NotificationsService } from 'src/app/notifications/services/notifications.service';
import { PasswordRecoveryService } from 'src/app/services/password-recovery-service';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.css']
})
export class ForgotpasswordComponent implements OnInit {
  form: FormGroup;
  isSubmit = false;
  loader = false;

  constructor(
    private formbuilder: FormBuilder,
    private passwordRecoveryService: PasswordRecoveryService, 
    private notificationsService: NotificationsService
  ) { }

  ngOnInit(): void {
    this.create();
  }
  create() {
    this.form = this.formbuilder.group({
      email: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
    });
  }
  get f() { return this.form.controls; }

  resetPasswordGenerateLink(email){
    this.isSubmit = true;
    if (this.form.invalid) { return; }

    this.loader = true;

    this.passwordRecoveryService.resetPasswordGenerateLink({email: email, lang: 'en'}).subscribe(response => {
      console.log(response);
      this.loader = false;
      this.notificationsService.showSuccess('Password recovery request is successfully submitted. Please check your email for password recovery link.')
    }, err => {
      console.log(err);
      this.loader = false;
    });
  }
}