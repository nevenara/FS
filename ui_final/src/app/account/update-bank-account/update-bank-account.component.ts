import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { IUserContext } from 'src/app/services/models/user-context';
import { PaymentSettingsService } from 'src/app/services/payment-settings-service';
import { UserService } from 'src/app/services/user-service';
import { UpdateBankAccountModalService } from './services/update-bank-account-modal-service'


@Component({
  selector: 'app-update-bank-account',
  templateUrl: './update-bank-account.component.html',
  styleUrls: ['./update-bank-account.component.css']
})
export class UpdateBankAccountComponent implements OnInit {
    @ViewChild('modalReference') modalReference: ElementRef<HTMLInputElement>;
    @Input() userId: string;
    @Output() successEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();

    show = 1;
    loaderInModal = 0;
    errorMsg: string = '';
    userContext: IUserContext;
    iban: string = '';
    addressDocument: Object = null;

    openUpdateBankAccountModalSubsctiption: Subscription
    
    errorMessage = '';
    ibanErrorMessage = '';

    constructor(
      private modalService: NgbModal, 
      private updateBankAccountModalService: UpdateBankAccountModalService,
      private paymentService: PaymentSettingsService,
      private userService: UserService,
      public translate: TranslateService

    ) {}

    ngOnInit() {
      this.openUpdateBankAccountModalSubsctiption = this.updateBankAccountModalService.openModal$.subscribe(() => {
        this.openUpdateBankAccountModal();
      });
      //const stripe = Stripe('pk_test_TYooMQauvdEDq54NiTphI7jx');
      this.userService.getUserContext().then(n => {
        this.userContext = n;
      });
    }

    ngOnDestroy() {
      this.openUpdateBankAccountModalSubsctiption.unsubscribe();
    }

    next() {
      if (this.show < 4) {
        this.show++;
      }
    }
    
    openUpdateBankAccountModal(){
        this.iban = '';
        this.ibanErrorMessage = '';
        this.addressDocument = null;
        this.show = 1;
        this.modalService.open(this.modalReference, { size: 'lg' }).result.then((result) => {  
        }, (reason) => {
        });;
    }

    selectedDocument(event) {
      this.addressDocument = event.target.files[0];
    }
  
    validateIbanNumber() {
      this.loaderInModal = 1;

      this.paymentService.validateIbanNumber(this.iban).subscribe(n => {
        if (!n.valid) {
          this.iban = '';
          this.loaderInModal = 0;
          this.ibanErrorMessage = n.messages.join(',');
          return;
        } else {
          this.loaderInModal = 0;
          this.next();
        }
      });
    }

    save() {
      this.loaderInModal = 1;
      // https://stripe.com/docs/connect/testing
      //for testing AT89370400440532013000
      //TODO VALIDATE IBAN NUMBER BY CALLING THAT VALIDATOR SERVICE..
  
      stripe
        .createToken('bank_account', {
          country: 'AT',
          currency: 'EUR',
          account_number: this.iban,
          account_holder_name: this.userContext.firstname + ' ' + this.userContext.lastname,
          account_holder_type: 'individual',
        })
        .then((result) => {
          // Handle result.error or result.token  
          if (result.error) {
            this.loaderInModal = 0;
            this.errorMessage = result.error;
            this.show = 4;
            return;
          }

          if (this.userId) {
            this.saveBankAccounDataByAdmin(result.token.id);
          } else {
            this.saveBankAccounData(result.token.id);
          }

        });
    }

    saveBankAccounData(tokenId) {
      this.paymentService.save({
        bankAccountStripeToken: tokenId,
        proofOfAddressDocument: this.addressDocument
      }).subscribe(n => {
        this.loaderInModal = 0;
        this.show = 3;
      }, err => {
        console.log(err);
        this.errorMessage = err;
        this.loaderInModal = 0;
        this.iban = '';
        this.addressDocument = '';
        this.show = 4;
      })
    }

    saveBankAccounDataByAdmin(tokenId) {
      this.paymentService.saveByAdmin({
        userId: this.userId,
        bankAccountStripeToken: tokenId,
        proofOfAddressDocument: this.addressDocument
      }).subscribe(n => {
        this.loaderInModal = 0;
        this.show = 3;
      }, err => {
        console.log(err);
        this.errorMessage = err;
        this.loaderInModal = 0;
        this.iban = '';
        this.addressDocument = '';
        this.show = 4;
      })
    }
}