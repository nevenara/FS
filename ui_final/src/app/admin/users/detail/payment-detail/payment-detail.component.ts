import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UserDetailsPreview } from 'src/app/admin/models/user-details-preview';
import { UserStatus } from 'src/app/admin/models/user-status';
import { GetAccountBalanceRequest } from 'src/app/admin/services/models/get-account-balance-request';
import { UserService } from 'src/app/admin/services/user-service';
import { Environment } from 'src/app/environments/environment';
import { AuthenticationService } from 'src/app/services/authentication-service';
import { UserType } from 'src/app/services/models/user-context';
import { DateFormatter } from 'src/app/shared/date-formatter';

@Component({
  selector: 'app-payment-detail',
  templateUrl: './payment-detail.component.html',
  styleUrls: ['./payment-detail.component.css']
})
export class PaymentDetailComponent implements OnInit {

  @Input() user: UserDetailsPreview = new UserDetailsPreview();
  @Output() getUserDataEmitter: EventEmitter<void> = new EventEmitter<void>();

  selfieImageUrl = Environment.serviceUrl + '/users/selfieimage?userId=';
  profileImageUrl = Environment.serviceUrl + '/users/profileimage?userId=';
  Userstatus = "Deactivate";

  loader = false;
  loadError = false;

  balance = 0;
  latestPayouts = [];

  dateFormatter: DateFormatter = new DateFormatter();
  userType: UserType;

  constructor(
    private userService: UserService,
    private authService: AuthenticationService
  ) { }

  ngOnInit(): void {
    this.getUserType();
    this.selfieImageUrl += this.user.userId;
    this.profileImageUrl += this.user.userId;
    if (this.user.status && this.user.status == UserStatus.VerifiedInclBankAccount) {
      this.getAccountBalance();
    }
  }

  getUserType() {
    this.authService.getUserType().subscribe(response => {
      this.userType = response.userType;
    })
  }

  getStatus(status) {
    this.Userstatus = "Deactivate";
    switch (status) {
      case 1:
        return "Registered";
      case 2:
        return "Verified";
      case 3:
        return "Verified incl. Bank Account";
      case 4:
        this.Userstatus = "Activate";
        return "Inactive"
        
      default: return "";
    }
  }

  getAccountBalance() {
    let request: GetAccountBalanceRequest = new GetAccountBalanceRequest();
    request.userId = this.user.userId;

    this.loader = true;

    this.userService.getAccountBalance(request).subscribe(response => {
      console.log(response);
      this.balance = 0;

      for (let i = 0; i < response.available.length; i++) {
        this.balance = this.balance + response.available[i].amount;
      }

      this.latestPayouts = response.payoutList.data;

      for (let i = 0; i < this.latestPayouts.length; i++) {
        this.latestPayouts[i].arrival_date = new Date(this.latestPayouts[i].arrival_date * 1000)  
      }

      this.loader = false;
    }, error => {
      //this.loadError = true;
      this.loader = false;
    });
  }

}
