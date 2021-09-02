import { Component, OnInit } from '@angular/core';
import { UserModel } from './user-model';

@Component({
  selector: 'app-complete-registration',
  templateUrl: './complete-registration.component.html',
  styleUrls: ['./complete-registration.component.css']
})
export class CompleteRegistrationComponent implements OnInit {

    user = new UserModel();
    current = 1;

    constructor() { }

    ngOnInit(): void {
}

    changeCurrent(current) {
        this.current = current;
    }

}
