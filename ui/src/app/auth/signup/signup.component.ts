import { Component, OnInit } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {RegistrationService} from  'src/app/services/registration-service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  closeResult = '';
  constructor(private modalService: NgbModal,
    private registrationService: RegistrationService) { }

  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
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
    this.registrationService.register({ email: email, password1: password1, password2: password2 }).subscribe(response => {
      console.log(response);
      alert(response.message);
    }, err => {
      console.log(err);
      alert(err.error.message);
    });
  }

  ngOnInit(): void {
  }
}