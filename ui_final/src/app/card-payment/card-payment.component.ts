import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { TicketsReservation } from '../marketplace/buy-ticket/models/tickets-reservation';
import { RepersonalizeTicketRequest } from '../services/models/get-re-personalize-ticket-request';
import { PayTicketsRequest, TicketBuy } from '../services/models/pay-tickets-request';
import { IUserContext } from '../services/models/user-context';
import { PaymentSettingsService } from '../services/payment-settings-service';
import { UserService } from '../services/user-service';
import { PaymentType } from './types/payment-type';
import { PaymentMethod } from './types/payment-method';
import { timeInterval } from 'rxjs/operators';
import { Environment } from '../environments/environment';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-card-payment',
  templateUrl: './card-payment.component.html',
  styleUrls: ['./card-payment.component.css']
})
export class CardPaymentComponent implements OnInit, AfterViewInit {

  @ViewChild('cardElement') cardElement: ElementRef;

  @Output() successPaymentEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() errorMessageEmitter: EventEmitter<string> = new EventEmitter<string>();

  @Input() paymentType: PaymentType;

  @Input() reservedTickets: TicketsReservation;

  @Input() ticketId: string;
  @Input() usernameOrEmail: string;

  @Input() price: number;

  userContext: IUserContext;
  clientSecret: string;
  cardStripeElement: any;
  errorMsg: string;

  paymentMethod: PaymentMethod = PaymentMethod.CREDIT_CARD;

  loaderInModal = false;
  loadingMessage = '';

  constructor(
    private cd: ChangeDetectorRef,
    private paymentService: PaymentSettingsService,
    private userService: UserService,
    private translate: TranslateService
  ) { }


  ngOnInit(): void {
    // const stripe = Stripe('pk_test_TYooMQauvdEDq54NiTphI7jx');
    this.userService.getUserContext().then(n => {
      this.userContext = n;
    });
  }

  ngAfterViewInit() {
    if (this.paymentMethod == PaymentMethod.CREDIT_CARD) {
      this.initCardPaymentForm();
    }
  }

  paymentMethodSelected() {
    if (this.paymentMethod == PaymentMethod.CREDIT_CARD) {
      this.initCardPaymentForm();
    }
  }

  initCardPaymentForm() {
    var elements = stripe.elements();
    //https://stripe.com/docs/js/elements_object/create_element

    this.cardStripeElement = elements.create("card", {
      iconStyle: 'solid',
      hidePostalCode: true,
      style: {
        base: {
          color: '#303238',
          fontSize: '16px',
          fontFamily: '"Open Sans", sans-serif',
          fontSmoothing: 'antialiased',
          '::placeholder': {
            color: '#CFD7DF',
          }
        },
        invalid: {
          color: '#e5424d',
          ':focus': {
            color: '#303238',
          }
        }
      }
    });
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

  pay() {
    this.loaderInModal = true;
    this.translate.get('notifications.cardPayment.preparingData').subscribe((data:any)=> {
      this.loadingMessage = data;
    });

    switch (this.paymentType) {
      case PaymentType.BuyTicket:
        this.buyTickets();
        break;
      case PaymentType.RePersonalizeTicket:
        this.repersonalizeTickets();
        break;
      default:
        this.translate.get('notifications.cardPayment.unknownPaymentType').subscribe((data:any)=> {
          this.errorMessageEmitter.emit(data);
        });
        this.successPaymentEmitter.emit(false);
        break;
    }

  }

  buyTickets() {
    let request = this.createBuyTicketRequest();

    this.translate.get('notifications.cardPayment.paymentInProgress').subscribe((data:any)=> {
      this.loadingMessage = data;
    });
    this.paymentService.payTickets(request).subscribe(intent => {
      console.log(intent.paymentIntentId);
      this.clientSecret = intent.paymentIntentClientSecret;
      if (this.paymentMethod === PaymentMethod.CREDIT_CARD) {
        this.cardPayment(intent.paymentIntentId);
      } else {
        this.sofortPayment(intent);
      }

    }, error => {
      console.log(error);
      this.errorMessageEmitter.emit(error);
      this.successPaymentEmitter.emit(false);
    });
  }

  repersonalizeTickets() {
    let request = new RepersonalizeTicketRequest();
    request.ticketId = this.ticketId;
    request.usernameOrEmail = this.usernameOrEmail;
    request.paymentMethod = this.paymentMethod;

    this.translate.get('notifications.cardPayment.paymentInProgress').subscribe((data:any)=> {
      this.loadingMessage = data;
    });
    this.paymentService.rePersonalizeTicket(request).subscribe(response => {
      console.log(response);
      this.clientSecret = response.paymentIntentClientSecret || null;
      if (this.paymentMethod === PaymentMethod.CREDIT_CARD) {
        this.cardPayment(response.paymentIntentId);
      } else {
        this.sofortPayment(response);
      }
    }, error => {
      console.log(error);
      this.errorMessageEmitter.emit(error);
      this.successPaymentEmitter.emit(false);
    });
  }

  sofortPayment(intent: any) {
    if (!this.clientSecret) {
      this.translate.get('notifications.cardPayment.paymentFailed').subscribe((data:any)=> {
        this.errorMessageEmitter.emit(data);
      });
      this.successPaymentEmitter.emit(false);
    }

    // Redirects away from the client
    stripe.confirmSofortPayment(
      this.clientSecret,
      {
        payment_method: {
          sofort: {
            country: intent.country
          }
        },
        return_url: Environment.frontendHost + window.location.pathname,
      }
    ).then(result => {
      if (result.error) {
        this.errorMessageEmitter.emit(result.error);
        this.successPaymentEmitter.emit(false);
      }
    });
  }

  cardPayment(paymentIntentId) {
    if (this.clientSecret) {
      this.translate.get('notifications.cardPayment.submitingCardDetails').subscribe((data:any)=> {
        this.loadingMessage = data;
      });
      stripe.confirmCardPayment(this.clientSecret, {
        payment_method: {
          card: this.cardStripeElement,
          //https://stripe.com/docs/api/payment_methods
          billing_details: {
            "address": {
              "city": this.userContext.city,
              "country": this.userContext.country,
              "line1": this.userContext.address,
              "postal_code": this.userContext.postCode,
            },
            name: this.userContext.firstname + ' ' + this.userContext.lastname
          }
        }
      }).then((result) => {
        if (result.error) {
          // Show error to your customer (e.g., insufficient funds)
          console.log(result.error.message);
          this.errorMessageEmitter.emit(result.error.message);
          this.successPaymentEmitter.emit(false);
          this.onPaymentFailed(paymentIntentId, result.error.message)
        } else {
          // The payment has been processed!
          if (result.paymentIntent.status === 'succeeded') {
            this.loaderInModal = true;
            this.translate.get('notifications.cardPayment.cardSubmitedSuccessfuly').subscribe((data:any)=> {
              this.loadingMessage = data;
            });
            this.confirmpaymentintentstatus(paymentIntentId);

          } else {
            this.translate.get('notifications.cardPayment.cardSubmitFailed').subscribe((data:any)=> {
              this.errorMessageEmitter.emit(data + " " + result.paymentIntent.status);
            }); 
            this.successPaymentEmitter.emit(false);
            this.onPaymentFailed(paymentIntentId, result.paymentIntent.status)
          }
        }
      });
    } else {
      this.translate.get('notifications.cardPayment.paymentFailed').subscribe((data:any)=> {
        this.errorMessageEmitter.emit(data);
      });
      this.successPaymentEmitter.emit(false);
    }
  }

  private onPaymentFailed(paymentIntentId: any, status: string) {
    this.paymentService.onPaymentFailed(paymentIntentId, status).subscribe(n => {

    })
  }

  confirmpaymentintentstatus(paymentIntentId) {
    this.paymentService.confirmpaymentintentstatus({ paymentIntentId: paymentIntentId }).subscribe(response => {
      console.log(response);

      switch (response.shoppingCartStatus) {
        case 1:
          setTimeout(() => {
            this.confirmpaymentintentstatus(paymentIntentId);
          }, 1000);
          break;
        case 2:
          this.loaderInModal = false;
          this.successPaymentEmitter.emit(true);
          break;
        case 3:
          this.loaderInModal = false;
          this.translate.get('notifications.cardPayment.cardSubmitFailed').subscribe((data:any)=> {
            this.errorMessageEmitter.emit(data + " " + response.status);
          }); 
          this.successPaymentEmitter.emit(false);
          break;
      }
    }, error => {
      console.log(error);
      this.errorMessageEmitter.emit(error);
      this.successPaymentEmitter.emit(false);
    });
  }

  createBuyTicketRequest() {
    let request = new PayTicketsRequest();
    request.tickets = [];
    request.ticketsToCancel = [];
    request.paymentMethod = this.paymentMethod;

    if (this.reservedTickets.assignee) {
      let ticketBuy: TicketBuy = new TicketBuy();
      ticketBuy.userId = this.reservedTickets.assignee.id;
      ticketBuy.ticketId = this.reservedTickets.id;

      request.tickets.push(ticketBuy);
    } else {
      request.ticketsToCancel.push(this.reservedTickets.id);
    }

    for (let i = 0; i < this.reservedTickets.tickets.length; i++) {
      if (this.reservedTickets.tickets[i].assignee) {
        let ticketBuy: TicketBuy = new TicketBuy();
        ticketBuy.userId = this.reservedTickets.tickets[i].assignee.id;
        ticketBuy.ticketId = this.reservedTickets.tickets[i].id;

        request.tickets.push(ticketBuy);
      } else {
        request.ticketsToCancel.push(this.reservedTickets.tickets[i].id);
      }
    }

    return request;
  }
}