import { Component, EventEmitter, Input,  OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-provide-bank-account-data',
  templateUrl: './provide-bank-account-data.component.html',
  styleUrls: ['./provide-bank-account-data.component.css']
})
export class ProvideBankAccountDataComponent implements OnInit {

    @Input() ibanErrorMessage: string = '';
    @Output() ibanEmitter: EventEmitter<string> = new EventEmitter<string>();
    ibanValue: string = '';

    constructor() { }

    ngOnInit(): void {}

}
