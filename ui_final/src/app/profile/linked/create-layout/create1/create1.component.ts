import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { OpenIdVerificationModalService } from 'src/app/id-verification/services/open-id-verification-modal.service';
import { NotificationsService } from 'src/app/notifications/services/notifications.service';
import { ConnectNewAccountRequest } from 'src/app/services/models/connect-new-account-request';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-create1',
  templateUrl: './create1.component.html',
  styleUrls: ['./create1.component.css'],
  providers: [ OpenIdVerificationModalService ]
})
export class Create1Component implements OnInit, AfterViewInit {

  @Input() connectRequest: ConnectNewAccountRequest;
  @Output() previousEmitter: EventEmitter<void> = new EventEmitter<void>();

  @Input() selectedIdParam;
  @Input() userHash;
  @Input() uuid;
  @Output() resetUuidEmitter: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    private router: Router,
    private openIdVerificationModalService: OpenIdVerificationModalService,
    private notificationsService: NotificationsService,
    public translate: TranslateService

  ) { 
  }

  ngOnInit() {
      
  }

  ngAfterViewInit() {
      if (this.uuid) {
        this.resetUuidEmitter.emit();
        this.openIdVerificationComponent();
      }
  }

  redirect(isSuccessful) {
    if (isSuccessful) {
      this.translate.get('notifications.profile.linkedAccountCreated').subscribe((data:any)=> {
        this.notificationsService.showSuccess(data);
      });
      this.router.navigateByUrl('/profile?type=2');
    } 
  }

  openIdVerificationComponent() {
    this.openIdVerificationModalService.openModal();
  }

}
