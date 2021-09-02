import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NotificationsService {
    showSuccessSource = new Subject<string>();
    showSuccess$ = this.showSuccessSource.asObservable();

    showErrorSource = new Subject<string>();
    showError$ = this.showErrorSource.asObservable();

    showSuccess(message) {
        this.showSuccessSource.next(message);
    }

    showError(message) {
        this.showErrorSource.next(message);
    }
}