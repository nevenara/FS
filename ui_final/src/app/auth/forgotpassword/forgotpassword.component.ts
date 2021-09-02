import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PasswordValidator } from 'src/app/shared/Validators/password-validator';
import { PasswordRecoveryService } from 'src/app/services/password-recovery-service';
import { NotificationsService } from 'src/app/notifications/services/notifications.service';
import { TranslateService } from '@ngx-translate/core';

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
    private router: Router, 
    private passwordRecoveryService: PasswordRecoveryService, 
    private notificationsService: NotificationsService, 
    public translate: TranslateService
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

    this.passwordRecoveryService.resetPasswordGenerateLink({email: email, lang: this.translate.currentLang}).subscribe(response => {
      console.log(response);
      this.loader = false;
      
      this.translate.get('notifications.auth.passwordRevocery').subscribe((data:any)=> {
        this.notificationsService.showSuccess(data);
      });
    }, err => {
      console.log(err);
      this.loader = false;
    });
  }
}
