import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmPasswordValidator } from 'src/app/shared/Validators/confirm-password';
import { PasswordValidator } from 'src/app/shared/Validators/password-validator';
import {RegistrationService} from  'src/app/services/registration-service';
import { NotificationsService } from 'src/app/notifications/services/notifications.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  form: FormGroup;
  isSubmit = false;
  closeResult = '';
  loader = false;

  isChecked = false;

  constructor(private modalService: NgbModal, private formbuilder: FormBuilder, private router: Router, private registrationService: RegistrationService, private notificationsService: NotificationsService, public translate: TranslateService) { }

  ngOnInit(): void {
    this.create();
  }

  create() {
    this.form = this.formbuilder.group({
      email: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
      password: ['', [Validators.required, PasswordValidator.patternValidator()]],
      confirmPassword: ['', Validators.required],
      isChecked: ['', Validators.required]
    }, {
      validator: ConfirmPasswordValidator('password', 'confirmPassword')
    });
  }

  get f() { return this.form.controls; }

 open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  register(email, password1, password2){
    if (this.isChecked) {
      this.isSubmit = true;
      if (this.form.invalid) { return; }

      this.loader = true;

      this.registrationService.register({ email: email, password1: password1, password2: password2, lang: this.translate.currentLang }).subscribe(response => {
        console.log(response);
        this.loader = false;
        this.router.navigate(['/auth/signup/user']);
      }, err => {
        console.log(err);
        this.loader = false;
      });
    }
    
  }
}
