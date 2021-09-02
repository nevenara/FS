import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
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

  @ViewChild('content1') content1: any;
  closeResult = '';
  form: FormGroup;
  isSubmit = false;

  username = '';
  password = '';
  userBlocked = false;

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
      username: ['', [Validators.required, noWhitespaceValidator ]],
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

  open1() {
    this.modalService.open(this.content1, { centered: true });
  }

  authenticate() {
    this.authService.authenticate({ username: this.username, password: this.password, applicationType: null, lang: null}).subscribe(response => {
     
     if(response.userStatus === "Blocked"){
       this.userBlocked = true;
       this.open1();
     }
     else{
      this.router.navigate(['/admin/dashboard']);
     }
    
    }, err => {
      console.log(err);
    });
  }

}
