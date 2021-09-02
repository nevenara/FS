import { Component, Input,  OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-repersonalization-success',
  templateUrl: './repersonalization-success.component.html',
  styleUrls: ['./repersonalization-success.component.css']
})
export class RepersonalizationSuccessComponent implements OnInit {

    constructor(private translate: TranslateService) { }

    ngOnInit(): void {
    }

}
