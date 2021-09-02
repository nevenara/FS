import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmPasswordValidator } from 'src/app/shared/Validators/confirm-password';
import { PasswordValidator } from 'src/app/shared/Validators/password-validator';
import { UserProfileService } from 'src/app/services/user-profile-service';
import { NotificationsService } from 'src/app/notifications/services/notifications.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-main-account',
  templateUrl: './main-account.component.html',
  styleUrls: ['./main-account.component.css']
})
export class MainAccountComponent implements OnInit {
  public form: FormGroup;
  isSubmit = false;
  loader = false;

  currentPassword = '';
  newPassword = '';
  confirmPassword = '';

  constructor(private formBuilder: FormBuilder, public translate: TranslateService, private userProfileService: UserProfileService, private notificationsService: NotificationsService) { }

  updateUserPassword(){
    this.isSubmit = true;
    if (this.form.invalid) { 
      return; 
    }

    this.loader = true;

    this.userProfileService.updateUserPassword({currentPassword: this.currentPassword, newPassword: this.newPassword, confirmPassword: this.confirmPassword}).subscribe(response => {
      console.log(response);
      this.loader = false;
      this.translate.get('notifications.account.passwordUpdated').subscribe((data:any)=> {
          this.notificationsService.showSuccess(data);
      });
    }, err => {
      console.log(err);
      this.loader = false;
    });
  }

  ngOnInit(): void {
    this.create();
  }

  create(){
    this.form = this.formBuilder.group({
      currentPass: ['', Validators.required],
      newPass: ['', [Validators.required, PasswordValidator.patternValidator()]],
      confirmNewPass: ['', Validators.required]
    },
    {
      validator: ConfirmPasswordValidator('newPass', 'confirmNewPass')
    });
  }

  resetForm() {
    this.isSubmit = false;
    this.currentPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';
  }

  get f(){
    return this.form.controls;
  }

}
