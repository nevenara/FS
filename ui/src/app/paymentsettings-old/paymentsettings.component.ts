import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IUserContext } from '../services/models/user-context';
import { UserService } from '../services/user-service';

@Component({
  selector: 'app-paymentsettings',
  templateUrl: './paymentsettings.component.html',
  styleUrls: ['./paymentsettings.component.css']
})
export class PaymentsettingsComponent implements OnInit {
  @ViewChild('ibanElement') ibanElement: ElementRef;
  ibanStripeElement: any;
  cardHandler = this.onChange.bind(this);
  cardError: string;
  errorMsg: string = '';
  ibanComplete: boolean = false;
  userContext: IUserContext;
  constructor(
    private cd: ChangeDetectorRef,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    // const stripe = Stripe('pk_test_TYooMQauvdEDq54NiTphI7jx');
    this.userService.getUserContext().then(n => {
      this.userContext = n;
    });
  }

  ngAfterViewInit() {
    this.initiateIBANElement();
  }

  ngOnDestroy() {
    if (this.ibanStripeElement) {
      // We remove event listener here to keep memory clean
      this.ibanStripeElement.off();
      this.ibanStripeElement.removeEventListener('change', this.cardHandler);
      this.ibanStripeElement.destroy();
    }
  }

  save(){
    if(!this.ibanComplete){
      alert('IBAN is not complete.');
      return;
    }

    var sourceData = {
      type: 'sepa_debit',
      currency: 'eur',
      owner: {
        name: this.userContext.firstname  + ' ' + this.userContext.lastname,
        email: this.userContext.email,
      },
      mandate: {
        // Automatically send a mandate notification email to your customer
        // once the source is charged.
        notification_method: this.userContext.email,
      },
    };

      // Call `stripe.createSource` with the IBAN Element and additional options.
      stripe.createSource(this.ibanElement, sourceData).then((result) => {
        if (result.error) {
          // Inform the customer that there was an error.
          var errorElement = document.getElementById('error-message');
          errorElement.textContent = result.error.message;
        } else {
          // Send the Source to your server.
          this.stripeSourceHandler(result.source);
        }
      });
  }

  stripeSourceHandler(source: any) {
    throw new Error('Method not implemented.');
  }

  private initiateIBANElement() {
    // Giving a base style here, but most of the style is in scss file
    const cardStyle = {
      base: {
        color: '#32325d',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a',
      },
    };

    this.ibanStripeElement = elements.create('iban', {
      style: cardStyle,
      supportedCountries: ['SEPA'], 
      // If you know the country of the customer, you can optionally pass it to
      // the Element as placeholderCountry. The example IBAN that is being used
      // as placeholder reflects the IBAN format of that country.
      placeholderCountry: 'AT',
    });
    this.ibanStripeElement.mount(this.ibanElement.nativeElement);

    this.ibanStripeElement.on('change', (event) => {

      //for testing AT483200000012345864
      if (event.error) {
        // show validation to customer
        // alert(event.error.message);
        this.errorMsg = event.error.message;
      } else {
        this.errorMsg = '';
      }
      this.ibanComplete = event.complete;

      this.cd.detectChanges();
    });
  }

  onChange({ error }) {
    if (error) {
      alert(error.message);
      this.cardError = error.message;
    } else {
      this.cardError = null;
    }
    this.cd.detectChanges();
  }
}