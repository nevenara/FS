import { Component, ElementRef, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { NotificationsService } from '../notifications/services/notifications.service';
import { IdVerificationService } from '../services/id-verification-service';
import { LinkedAccountsService } from '../services/linked-accounts-service';
import { ConnectNewAccountRequest } from '../services/models/connect-new-account-request';
import { IdCheckAccountByAdminRequest } from '../services/models/id-check-account-by-admin-request';
import { IdCheckLinkedAccountRequest } from '../services/models/id-check-linked-account-request';
import { VerifyIdRequest } from '../services/models/verify-id-request';
import { OpenIdVerificationModalService } from './services/open-id-verification-modal.service';

@Component({
  selector: 'app-id-verification',
  templateUrl: './id-verification.component.html',
  styleUrls: ['./../personalization/detail/detail.component.css','./id-verification.component.css']
})
export class IdVerificationComponent implements OnInit, OnDestroy {
  @Input() linkedAccountRequest: ConnectNewAccountRequest;
  @Input() userId: string = null;
  @Output() onFinishEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();
  @ViewChild('modalReference') modalReference: ElementRef<HTMLInputElement>;

  selectedId = 1;
  innerWidth: any;
  
  qrCode: string;
  @Input() selectedIdParam: number;
  @Input() pageType: number;
  @Input() urlParams: string;

  idDocFront: Object = null;
  idDocBack: Object = null;
  selfieImage: Object = null;
  
  errorMessage = '';
  show = 1;
  loader = 0;

  openIdVerificationModalSubscription: Subscription;

  constructor(
    private modalService: NgbModal,
    private openIdVerificationModalService: OpenIdVerificationModalService,
    private idVerificationService: IdVerificationService,
    private linkedAccountsService: LinkedAccountsService,
    private notificationsService: NotificationsService,
    private translate: TranslateService
  ) {

  }

  ngOnInit(): void {
    this.openIdVerificationModalSubscription = this.openIdVerificationModalService.openModal$.subscribe(() => {
      this.openIdVerificationComponent();
      this.show = 1;
      if(+this.selectedIdParam && +this.selectedIdParam >=1 && +this.selectedIdParam <= 3) {
        this.selectedId = +this.selectedIdParam;
        this.show = 3;
        this.getQrCode();
      }
    });
    this.innerWidth = window.innerWidth;
  }

  ngAfterViewInit(): void{
   
  }

  ngOnDestroy() {
    this.openIdVerificationModalSubscription.unsubscribe();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
    //console.log(this.innerWidth)
  }

  changeSelectedId(id){
    this.selectedId = id;
  }


  next() {
    if (this.show < 4) {
      this.show ++;

      if (this.show == 3) {
        this.getQrCode();
      }
    }
  }

  previous() {
    if (this.show > 1) {
      this.show --;
    }

    if (this.show < 3) {
      this.idDocBack = null;
      this.idDocFront = null;
    }

    if (this.show < 4) {
      this.selfieImage = null;
    }
  }

  openIdVerificationComponent() {
    this.modalService.open(this.modalReference, { size: 'lg' }).result.then((result) => {  
    }, (reason) => {
      this.onFinishEmitter.emit(this.show == 5 ? true : false);
    });
  }

  verifyId() {
    this.loader = 1;
    if (this.linkedAccountRequest) {
      this.verifyLinkedAccountId();
    } else if(this.userId) {
      this.verifyIdByAdmin();
    } else {
      this.verifyMainAccountId();
    }
  }

  verifyMainAccountId() {
    let request = new VerifyIdRequest();
    request.idDocument = this.idDocFront;
    request.selfieImage = this.selfieImage;
    this.idVerificationService.verifyId(request).subscribe(response => {
      console.log(response);
      this.show = 5;
      this.loader = 0;
    }, error => {
      console.log(error);
      this.errorMessage = error;
      this.show = 6;
      this.loader = 0;
    });
  }

  verifyIdByAdmin() {
    const request: IdCheckAccountByAdminRequest = new IdCheckAccountByAdminRequest();

    request.userId = this.userId;
    request.idDocumentFile = this.idDocFront;
    request.selfieImage = this.selfieImage;

    this.idVerificationService.idCheckAccountByAdmin(request).subscribe(response => {
      console.log(response);
      this.show = 5;
      this.loader = 0;
    }, err => {
      this.errorMessage = err;
      this.show = 6;
      this.loader = 0;
    });
  }

  verifyLinkedAccountId() {
    this.linkedAccountsService.connectNewAccount(this.linkedAccountRequest).subscribe(response => {
      const request: IdCheckLinkedAccountRequest = new IdCheckLinkedAccountRequest();

      request.linkedAccountId = response.id;
      request.idDocumentFile = this.idDocFront;
      request.selfieImage = this.selfieImage;

      this.linkedAccountsService.idCheckLinkedAccount(request).subscribe(response => {
        this.translate.get('notifications.idVerification.linkedAccountCreated').subscribe((data:any)=> {
          this.notificationsService.showSuccess(data);
        }); 
        
        this.show = 5;
        this.loader = 0;
      }, err => {
        this.errorMessage = err;
        this.show = 6;
        this.loader = 0;
      });
    }, error => {
        this.errorMessage = error;
        this.show = 6;
        this.loader = 0;
    })

    
  }

  getQrCode() {
    this.loader = 1;
    this.idVerificationService.getQrCode({pageType: this.pageType, urlParams: this.urlParams, selectedId: this.selectedId}).subscribe(response => {   
      this.qrCode = response.qrCode;
      this.loader = 0;
    }, error => {
      console.log(error);
      this.loader = 0;
    });
  }
}
