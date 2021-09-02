import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class TicketRePersonalizeService {
    openModalSource = new Subject<string>();
    openModal$ = this.openModalSource.asObservable();

    openModal(ticketId) {
        this.openModalSource.next(ticketId);
    }

}
