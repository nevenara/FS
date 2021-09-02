import { Component,  EventEmitter,  OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-upload-address-document',
  templateUrl: './upload-address-document.component.html',
  styleUrls: ['./upload-address-document.component.css']
})
export class UploadAddressDocumentComponent implements OnInit {

    @Output() addressDocumentEmitter: EventEmitter<Object> = new EventEmitter<Object>();
    addressDocument: Object = null;
    constructor() { }

    ngOnInit(): void {}

    uploadAddressDocument(document) {
        this.addressDocument = document.target.files[0];
        this.addressDocumentEmitter.emit(this.addressDocument);
    }
}
