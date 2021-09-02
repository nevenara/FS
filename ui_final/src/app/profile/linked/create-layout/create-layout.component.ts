import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { NotificationsService } from 'src/app/notifications/services/notifications.service';
import { LinkedAccountsService } from 'src/app/services/linked-accounts-service';
import { ConnectNewAccountRequest } from 'src/app/services/models/connect-new-account-request';
import { QrService } from 'src/app/services/qr-service';
import { LinkedAccount } from '../models/linked-account';

@Component({
  selector: 'app-create-layout',
  templateUrl: './create-layout.component.html',
  styleUrls: ['./create-layout.component.css']
})
export class CreateLayoutComponent implements OnInit {
    show = 1;

    loader = false;

    connectRequest: ConnectNewAccountRequest;
    selectedIdParam;
    userHash;
    uuid;

    relationEn = [
      'Grandfather', 'Grandmother', 'Father', 'Mother', 'Wife', 'Partner', 'Child', 'Brother', 'Sister', 'Uncle', 'Aunt'
    ];

    constructor(
        private linkedAccountsService: LinkedAccountsService,
        private notificationsService: NotificationsService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private qrService: QrService,
        private cdr: ChangeDetectorRef,
        private translate: TranslateService
    ) {

    }

    ngOnInit() {
      this.activatedRoute.params.subscribe(data => {
        this.uuid = this.activatedRoute.snapshot.queryParamMap.get("uuid");

        if (this.uuid) {
            this.qrService.getUrlParams(this.uuid).subscribe(response => {
              this.userHash = response.urlParams;
              this.connectRequest = JSON.parse(atob((this.userHash)));
              this.selectedIdParam = response.selectedId;

              if (this.selectedIdParam) {
                this.show = 2;
              }

              this.cdr.detectChanges();
          })
        }

        
      });
    }

    resetUuid() {
      this.uuid = null;
    }

    next(request) {
      this.connectRequest = request;
      const diff = moment().diff(request.birthDate, 'years');

      if (diff <= 16) {
        this.connectNewAccount();
      } else {
        this.userHash = btoa(JSON.stringify(this.connectRequest));
        this.show = 2;
      }
    }

    connectNewAccount() {
      this.loader = true;
      this.connectRequest.relationToMainAccount = this.relationEn[this.connectRequest.relationToMainAccountObj.item_id - 1]
      this.linkedAccountsService.connectNewAccount(this.connectRequest).subscribe(response => {
          console.log(response);
          this.loader = false;
          this.translate.get('notifications.profile.linkedAccountCreated').subscribe((data:any)=> {
            this.notificationsService.showSuccess(data);
          });
          this.router.navigateByUrl('/profile?type=2');
        }, err => {
          console.log(err);
          this.loader = false;
        });
    }
}