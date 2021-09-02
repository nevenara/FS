import { Component, Input,  OnInit } from '@angular/core';

@Component({
  selector: 'id-verification-success',
  templateUrl: './id-verification-success.component.html',
  styleUrls: ['./id-verification-success.component.css']
})
export class idVerificationSuccess implements OnInit {

  @Input() show: number;
    constructor() { }

    ngOnInit(): void {}

}
