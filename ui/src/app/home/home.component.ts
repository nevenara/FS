import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication-service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private authService: AuthenticationService) { }

  ngOnInit(): void {
    debugger;
    this.authService.getUserContext().subscribe(res => {
      console.log(`User Context ${JSON.stringify(res)}`);

    }, err => {
      alert(err);
    })
  }
}
