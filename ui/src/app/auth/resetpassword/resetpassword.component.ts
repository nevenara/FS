import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PasswordRecoveryService } from 'src/app/services/password-recovery-service';

@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.css']
})
export class ResetpasswordComponent implements OnInit {

  constructor(private route :ActivatedRoute,
    private passwordRecoveryService: PasswordRecoveryService) { }
  uuid: string;

  resetPassword(password, confirmPassword){
    this.passwordRecoveryService.resetPassword({uuid: this.uuid, password: password, confirmPassword: confirmPassword}).subscribe(response => {
      console.log(response);
    }, err => {
      console.log(err);
    });
  }

  ngOnInit(): void {
    this.uuid = this.route.snapshot.queryParamMap.get('uuid');
  }

}
