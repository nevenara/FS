import { Component } from '@angular/core';
import {SessionService } from './services/session-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  idInterval: number;

  constructor(
    private sessionService: SessionService
    ) { }

  ngOnInit() { 
    console.log('Register interval for keep session alive.');

    this.idInterval = setInterval(() => {
      console.log('Interval keep session alive was called.');
      this.sessionService.keepSessionAlive().subscribe(res => {
        console.log(`User Context ${JSON.stringify(res)}`);
  
      }, err => {
        alert(err);
      })

    }, 200000);
  }
}
