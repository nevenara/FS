import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { UserProfileService } from 'src/app/services/user-profile-service';
import { UpdateBankAccountModalService } from '../update-bank-account/services/update-bank-account-modal-service'

@Component({
  selector: 'app-paymentsettings',
  templateUrl: './paymentsettings.component.html',
  styleUrls: ['./paymentsettings.component.css'],
  providers: [UpdateBankAccountModalService, TranslateService]
})
export class PaymentsettingsComponent implements OnInit {
  
  loader = 1;
  stripeActivated: boolean = false;
  stripeActivationPending: boolean = false;
  idVerified = false;

  constructor(
    private updateBankAccountModalService: UpdateBankAccountModalService,
    private userProfileService: UserProfileService,
    public translate: TranslateService
  ) { 
  }

  ngOnInit(): void {
    this.loader = 1;
      this.userProfileService.getBankAccountDetails().subscribe(response => {

        if (response.bankAccountId) {
          this.stripeActivated = true;

          if (!response.stripeAccountStatus || !(response.stripeAccountStatus == 'verified')) {
            this.stripeActivationPending = true;
          }
        }

        if (response.userStatus == 'IdVerified') {
          this.idVerified = true;
        }
        
        this.loader = 0;
      }, error => {
        console.log(error);
        this.loader = 0;
      });
  }

  openUpdateBankAccountDialog(){
    this.updateBankAccountModalService.openModal();
  }
  
}