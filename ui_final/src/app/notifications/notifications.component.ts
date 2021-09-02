import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { NotificationsService } from './services/notifications.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit, OnDestroy {

    showSuccessSubscription: Subscription;
    showErrorSubscription: Subscription;

    successMessage = '';
    errorMessage = '';

    @ViewChild('successAlert', {static: false}) successAlert: NgbAlert;

    constructor(private notificationsService: NotificationsService) {

    }

    ngOnInit(): void {
        this.showSuccessSubscription = this.notificationsService.showSuccess$.subscribe((message) => {
            this.showSuccess(message);
        });

        this.showErrorSubscription = this.notificationsService.showError$.subscribe((message) => {
            this.showError(message);
        });
    }

    ngOnDestroy(): void {
        this.showSuccessSubscription.unsubscribe();
        this.showErrorSubscription.unsubscribe();
    }

    showSuccess(message) {
        this.errorMessage = '';
        this.successMessage = message;
        setTimeout(() => {
            if (this.successAlert) {
                this.successAlert.close();
            }
        }, 2000);
    }

    showError(message) {
        this.successMessage = '';
        this.errorMessage = message;
    }
}
