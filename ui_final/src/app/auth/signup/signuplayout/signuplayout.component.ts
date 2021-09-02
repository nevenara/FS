import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-signuplayout',
  templateUrl: './signuplayout.component.html',
  styleUrls: ['./signuplayout.component.css']
})
export class SignuplayoutComponent implements OnInit {

  constructor(private translate: TranslateService) { }

  ngOnInit(): void {
  }

}
