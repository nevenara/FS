import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
  public show:boolean = true;
  public hide:boolean = false;

  constructor() { }

  ngOnInit(): void {
  }
  
  toggle() {
    this.show = !this.show;
    this.hide = !this.hide;
  }

}
