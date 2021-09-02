import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-choose-id-document',
  templateUrl: './choose-id-document.component.html',
  styleUrls: ['./choose-id-document.component.css']
})
export class ChooseIdDocumentComponent implements OnInit {

  @Input() selectedId: number;
  @Output() changeSelectedIdEvent: EventEmitter<number> = new EventEmitter<number>();

  emitChangeSelectedID() {
    this.changeSelectedIdEvent.emit(this.selectedId);
  }

    constructor() { }

    ngOnInit(): void {}

}
