import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UpdateBankAccountModalService } from 'src/app/account/update-bank-account/services/update-bank-account-modal-service';
import { OpenIdVerificationModalService } from 'src/app/id-verification/services/open-id-verification-modal.service';
import { QrService } from 'src/app/services/qr-service';
@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.css'],
  providers: [ OpenIdVerificationModalService, UpdateBankAccountModalService ]
})
export class VerificationComponent implements OnInit, AfterViewInit {
  @Input() userId: string;
  @Input() verified: boolean = false;
  @Output() onFinishEmitter: EventEmitter<void> = new EventEmitter<void>();

  @Input() selectedIdParam;

  constructor(
    private openIdVerificationModalService: OpenIdVerificationModalService,
    private updateBankAccountModalService: UpdateBankAccountModalService,
    private activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private qrService: QrService
  ) { }

  ngOnInit() {
    
  }

  ngAfterViewInit(): void {
    this.activatedRoute.params.subscribe(data => {
      let uuid = this.activatedRoute.snapshot.queryParamMap.get("uuid");

      if (uuid) {
          this.qrService.getUrlParams(uuid).subscribe(response => {
          this.selectedIdParam = response.selectedId;

          this.cdr.detectChanges();

          if (this.selectedIdParam) {
            this.openIdVerificationComponent();
          }
        })
      }
      
    });
  }

  openIdVerificationComponent() {
    this.openIdVerificationModalService.openModal();
  }

  openUpdateBankAccountSettings() {
    this.updateBankAccountModalService.openModal();
  }

  reloadData(success) {
    if (success) {
      this.onFinishEmitter.emit();
    }
  }
}
