import { Component, Input,  OnInit } from '@angular/core';

@Component({
  selector: 'app-failed-update',
  templateUrl: './failed-update.component.html',
  styleUrls: ['./failed-update.component.css']
})
export class FailedUpdateComponent implements OnInit {

    @Input() errorMessage: string;

    constructor() { }

    ngOnInit(): void {
    }

}
