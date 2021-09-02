import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { PasswordValidator } from 'src/app/shared/Validators/password-validator';
import { noWhitespaceValidator } from 'src/app/shared/Validators/no-white-space-validator';
import { AuthenticationService } from 'src/app/services/authentication-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  closeResult = '';
  form: FormGroup;
  isSubmit = false;

  username = '';
  password = '';

  constructor(
    private modalService: NgbModal, 
    private formbuilder: FormBuilder, 
    private router: Router,
    private authService: AuthenticationService
  ) { }


  ngOnInit(): void {
    this.create();
  }
  create(){
    this.form = this.formbuilder.group({
      email: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
      password: ['', [
        Validators.required,
        PasswordValidator.patternValidator() ]]
    });
  }
  get f() {return this.form.controls; }

  onSubmit() {
    this.isSubmit = true;
    if(this.form.invalid) {return; }

    this.authenticate();

  }

  open(content) {
    this.modalService.open(content, { centered: true });
  }
  open1(content1) {
    this.modalService.open(content1, { centered: true });
  }

  authenticate() {
    this.authService.authenticate({ username: this.username, password: this.password, applicationType: null, lang: null}).subscribe(response => {
      this.router.navigate(['/organizer/dashboard']);
    }, err => {
      console.log(err);
    });
  }

}
