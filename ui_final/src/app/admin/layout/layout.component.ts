import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class ALayoutComponent implements OnInit {

  isSidebar = true;
  constructor() { }

  ngOnInit(): void {
  }


}
