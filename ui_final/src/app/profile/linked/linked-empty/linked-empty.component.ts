import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-linked-empty',
  templateUrl: './linked-empty.component.html',
  styleUrls: ['./linked-empty.component.css']
})
export class LinkedEmptyComponent implements OnInit {

  constructor(    
    public translate: TranslateService
    ) 
    { }

  ngOnInit(): void {
  }

}
