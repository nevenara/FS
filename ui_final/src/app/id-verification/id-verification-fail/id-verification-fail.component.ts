import { Component, Input,  OnInit } from '@angular/core';

@Component({
  selector: 'app-id-verification-fail',
  templateUrl: './id-verification-fail.component.html',
  styleUrls: ['./id-verification-fail.component.css']
})
export class idVerificationFail implements OnInit {

  @Input() errorMessage: string;
  
    constructor() { }

    ngOnInit(): void {
    }

}
