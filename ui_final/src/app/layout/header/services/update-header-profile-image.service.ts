import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UpdateHeaderProfileImageService {

    updateProfileImageSource = new Subject<void>();
    updateProfileImage$ = this.updateProfileImageSource.asObservable();

    updateHeaderProfileImage() {
        this.updateProfileImageSource.next();
    }

}