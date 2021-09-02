import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-upload-id-document',
  templateUrl: './upload-id-document.component.html',
  styleUrls: ['./upload-id-document.component.css']
})
export class UploadIdDocumentComponent implements OnInit {

    @Input() show: number;
    @Input() selectedId: number;
    constructor() { }

    ngOnInit(): void {
      console.log(this.selectedId);
    }
    

}
