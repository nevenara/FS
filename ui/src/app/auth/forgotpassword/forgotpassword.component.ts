import { Component, OnInit } from '@angular/core';
import { PasswordRecoveryService } from 'src/app/services/password-recovery-service';
@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.css']
})
export class ForgotpasswordComponent implements OnInit {

  constructor(private passwordRecoveryService: PasswordRecoveryService) { }

  resetPasswordGenerateLink(email){
    this.passwordRecoveryService.resetPasswordGenerateLink({email: email}).subscribe(response => {
      console.log(response);
    }, err => {
      console.log(err);
    });
  }

  ngOnInit(): void {
  }

}
