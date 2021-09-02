import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationsService } from 'src/app/notifications/services/notifications.service';
import { PasswordRecoveryService } from 'src/app/services/password-recovery-service';
import { PasswordValidator } from 'src/app/shared/Validators/password-validator';
import { ConfirmPasswordValidator } from './../../../shared/Validators/confirm-password';

@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.css']
})
export class ResetpasswordComponent implements OnInit {
  form: FormGroup;
  isSubmit = false;
  loader = false;
  uuid: string;

  constructor(
    private formbuilder: FormBuilder, 
    private router: Router,
    private passwordRecoveryService: PasswordRecoveryService,
    private notificationsService: NotificationsService,
    private route: ActivatedRoute
  ) { }

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

  resetPassword(password, confirmPassword){
    this.isSubmit = true;
    if (this.form.invalid) { return; }

    this.loader = true;

    this.passwordRecoveryService.resetPassword({uuid: this.uuid, password: password, confirmPassword: confirmPassword, lang: null}).subscribe(response => {
      console.log(response);
      this.loader = false;
      this.notificationsService.showSuccess("Password is successfully reset.");
      this.router.navigate(['/organizer/auth']);
    }, err => {
      this.loader = false;
      console.log(err);
    });
  }
}
