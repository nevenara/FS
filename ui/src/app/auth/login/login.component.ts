import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from 'src/app/services/authentication-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  closeResult = '';
  constructor(
    private modalService: NgbModal,
    private authService: AuthenticationService,
    private router: Router) { }

  open(content) {
    this.modalService.open(content, { centered: true });
  }

  open1(content1) {
    this.modalService.open(content1, { centered: true });
  }

  authenticate(username, password) {
    this.authService.authenticate({ username: username, password: password }).subscribe(response => {
      console.log(response);
      this.router.navigateByUrl('/home');
    }, err => {
      alert(err);
      console.log(err);
    });
  }

  ngOnInit(): void {
  }

}