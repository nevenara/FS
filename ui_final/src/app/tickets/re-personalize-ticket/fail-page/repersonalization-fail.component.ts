import { Component, Input,  OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-repersonalization-fail',
  templateUrl: './repersonalization-fail.component.html',
  styleUrls: ['./repersonalization-fail.component.css']
})
export class RepersonalizationFailComponent implements OnInit {

  @Input() errorMessage: string;
  
    constructor(private translate: TranslateService) { }

    ngOnInit(): void {
    }

}
