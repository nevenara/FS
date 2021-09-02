import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PasswordValidator } from 'src/app/shared/Validators/password-validator';
import { ConfirmPasswordValidator } from './../../shared/Validators/confirm-password';
import { ActivatedRoute } from '@angular/router';
import { PasswordRecoveryService } from 'src/app/services/password-recovery-service';
import { NotificationsService } from 'src/app/notifications/services/notifications.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.css']
})
export class ResetpasswordComponent implements OnInit {
  form: FormGroup;
  isSubmit = false;
  loader = false;

  constructor(
    private formbuilder: FormBuilder, 
    private router: Router,
    private route :ActivatedRoute,
    private passwordRecoveryService: PasswordRecoveryService,
    private notificationsService: NotificationsService,
    public translate: TranslateService
    ) { }
  uuid: string;

  resetPassword(password, confirmPassword){
    this.isSubmit = true;
    if (this.form.invalid) { return; }

    this.loader = true;

    this.passwordRecoveryService.resetPassword({uuid: this.uuid, password: password, confirmPassword: confirmPassword, lang: this.translate.currentLang}).subscribe(response => {
      console.log(response);
      this.loader = false;
      this.translate.get('notifications.auth.passwordReset').subscribe((data:any)=> {
        this.notificationsService.showSuccess(data);
      });
      this.router.navigate(['/auth/login']);
    }, err => {
      this.loader = false;
      console.log(err);
    });
  }

  ngOnInit(): void {
    this.uuid = this.route.snapshot.queryParamMap.get('uuid');
    this.create();
  }

  create() {
    this.form = this.formbuilder.group({
      confirmPassword: ['', Validators.required],
      password: ['', [Validators.required, PasswordValidator.patternValidator()]]
    }, {
      validator: ConfirmPasswordValidator('password', 'confirmPassword')
    });
  }

  get f() { return this.form.controls; }

}
