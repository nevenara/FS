import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class LocalisationService {
    changeLanguageSource = new Subject<void>();
    changeLanguage$ = this.changeLanguageSource.asObservable();

    changeLanguage() {
        this.changeLanguageSource.next();
    }

}