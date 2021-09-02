import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IUserContext } from '../services/models/user-context';
import { UserService } from '../services/user-service';
import { PaymentSettingsService } from '../services/payment-settings-service';

@Component({
  selector: 'app-paymentsettings',
  templateUrl: './paymentsettings.component.html',
  styleUrls: ['./paymentsettings.component.css']
})
export class PaymentsettingsComponent implements OnInit {
  @ViewChild('ibanElement') ibanElement: ElementRef;
  cardError: string;
  errorMsg: string = '';
  userContext: IUserContext;
  ibanValue: string;
  proofOfAddressFile: any;

  constructor(
    private cd: ChangeDetectorRef,
    private paymentService: PaymentSettingsService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    // const stripe = Stripe('pk_test_TYooMQauvdEDq54NiTphI7jx');
    this.userService.getUserContext().then(n => {
      this.userContext = n;
    });
  }

  ngAfterViewInit() {
  }


  ngOnDestroy() {

  }

  selectedDocument(event) {
    this.proofOfAddressFile = event.target.files[0];
  }

  save() {
    // https://stripe.com/docs/connect/testing
    //for testing AT89370400440532013000
    //TODO VALIDATE IBAN NUMBER BY CALLING THAT VALIDATOR SERVICE..
    if (!this.ibanValue) {
      alert('IBAN is required.');
      return;
    }

    if (!this.proofOfAddressFile) {
      alert('Proof of address document must be selected.');
      return;
    }

    this.paymentService.validateIbanNumber(this.ibanValue).subscribe(n => {
      if (!n.valid) {
        alert(n.messages.join(','));
        return;
      }

      stripe
        .createToken('bank_account', {
          country: 'AT',
          currency: 'EUR',
          account_number: this.ibanValue,
          account_holder_name: this.userContext.firstname + ' ' + this.userContext.lastname,
          account_holder_type: 'individual',
        })
        .then((result) => {
          // Handle result.error or result.token  
          if (result.error) {
            alert(result.error);
            return;
          }

          this.paymentService.save({
            bankAccountStripeToken: result.token.id,
            proofOfAddressDocument: this.proofOfAddressFile
          }).subscribe(n => {
            alert('Saved successfully.')
          }, err => {
            console.log(err);
            alert(err.error.message);
          })
        });
    });
  }
}