import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IUserContext } from '../services/models/user-context';
import { PaymentSettingsService } from '../services/payment-settings-service';
import { UserService } from '../services/user-service';

@Component({
  selector: 'app-card-payment',
  templateUrl: './card-payment.component.html',
  styleUrls: ['./card-payment.component.css']
})
export class CardPaymentComponent implements OnInit {
  @ViewChild('cardElement') cardElement: ElementRef;
  userContext: IUserContext;
  clientSecret: string;
  cardStripeElement: any;
  errorMsg: string;

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
    this.initCardPaymentForm();
  }


  ngOnDestroy() {

  }

  initCardPaymentForm() {
    var elements = stripe.elements();
    var style = {
      base: {
        color: "#32325d",
      }
    };

    this.cardStripeElement = elements.create("card", { style: style });
    this.cardStripeElement.mount(this.cardElement.nativeElement);

    this.cardStripeElement.on('change', ({ error }) => {
      if (error) {
        // show validation to customer
        // alert(event.error.message);
        this.errorMsg = error.message;
      } else {
        this.errorMsg = '';
      }

      this.cd.detectChanges();
    });
  }

  payForTheTicket() {
    //ticket id is hard coded for now..
    if (!this.clientSecret) {
      this.paymentService.createPaymentIntent({ ticketId: '5f743c415dda3e430c3d123d' }).subscribe(intent => {
        console.log(intent.client_secret);
        this.clientSecret = intent.client_secret;
        this.sendCardDetails();
      });
    } else {
      this.sendCardDetails();
    }
  }

  private sendCardDetails() {
    debugger;
    stripe.confirmCardPayment(this.clientSecret, {
      payment_method: {
        card: this.cardStripeElement,
        billing_details: {
          name:  this.userContext.firstname + ' ' + this.userContext.lastname
        }
      }
    }).then(function (result) {
      if (result.error) {
        debugger;
        // Show error to your customer (e.g., insufficient funds)
        console.log(result.error.message);
      } else {
        // The payment has been processed!
        if (result.paymentIntent.status === 'succeeded') {
          // Show a success message to your customer
          // There's a risk of the customer closing the window before callback
          // execution. Set up a webhook or plugin to listen for the
          // payment_intent.succeeded event that handles any business critical
          // post-payment actions.
        }
      }
    });
  }
}