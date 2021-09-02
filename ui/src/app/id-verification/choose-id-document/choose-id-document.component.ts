import { Component, EventEmitter, Input,  OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-choose-id-document',
  templateUrl: './choose-id-document.component.html',
  styleUrls: ['./choose-id-document.component.css']
})
export class ChooseIdDocumentComponent implements OnInit {

  @Input() show: number;
  @Input() selectedId: number;
  @Output() newItemEvent = new EventEmitter<number>();

  addNewItem(selectedId: number) {
    this.newItemEvent.emit(selectedId);
  }

  logId(){
    // console.log(this.selectedId);
  }
    constructor() { }

    ngOnInit(): void {}

}
