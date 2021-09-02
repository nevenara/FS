import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {



  constructor(private modalService: NgbModal) {}

  open1(content1) {
    this.modalService.open(content1,{ size: 'xl' } );
  }


  ngOnInit(): void {
  }

}
