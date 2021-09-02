import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { PasswordValidator } from 'src/app/shared/Validators/password-validator';
import { noWhitespaceValidator } from 'src/app/shared/Validators/no-white-space-validator';
import { AuthenticationService } from 'src/app/services/authentication-service';
import { NotificationsService } from 'src/app/notifications/services/notifications.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  closeResult = '';
  form: FormGroup;
  isSubmit = false;
  @ViewChild('content1') content1: any;


  username = '';
  password = '';

  constructor(
    private modalService: NgbModal,
    private formbuilder: FormBuilder,
    private router: Router,
    private authService: AuthenticationService,
    private notificationsService: NotificationsService,
    public translate: TranslateService
  ) { }


  ngOnInit(): void {
    this.create();


  }
  create() {
    this.form = this.formbuilder.group({
      username: ['', [Validators.required, noWhitespaceValidator]],
      password: ['', [
        Validators.required,
        PasswordValidator.patternValidator()]]
    });
  }
  get f() { return this.form.controls; }

  onSubmit() {
    this.isSubmit = true;
    if(this.form.invalid) {return; }

    // this.authenticate();

  }

  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }
  open1() {
    this.modalService.open(this.content1, { centered: true });
  }

  authenticate() {
    this.isSubmit = true;
    if(this.form.invalid) {return; }
    this.authService.authenticate({ username: this.form.value.username, password: this.form.value.password, applicationType: null, lang: this.translate.currentLang }).subscribe(response => {
      if(response.userStatus === 'Blocked'){
        this.open1();
      }
      else if (response.userStatus === 'EmailVerified') {
        this.router.navigateByUrl('/auth/signup/completeregistration');
      } else {
        this.router.navigateByUrl('/home');
      }
    }, err => {
      console.log(err);
    });
  }
}
