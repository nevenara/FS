import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class OpenIdVerificationModalService {
    openModalSource = new Subject<void>();
    openModal$ = this.openModalSource.asObservable();

    openModal() {
        this.openModalSource.next();
    }

}