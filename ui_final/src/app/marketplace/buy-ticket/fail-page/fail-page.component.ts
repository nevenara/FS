import { Component, Input,  OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-fail-page',
  templateUrl: './fail-page.component.html',
  styleUrls: ['./fail-page.component.css']
})
export class FailPageComponent implements OnInit {

  @Input() errorMessage: string;
  
    constructor(private translate: TranslateService) { }

    ngOnInit(): void {
    }

}
