import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'errors',
  templateUrl: './errors.component.html',
  styleUrls: ['./errors.component.css']
})
export class ErrorsComponent implements OnInit {
  @Input() control: FormControl;
  @Input() isSubmit: string;
  constructor(private translate: TranslateService) { }

  ngOnInit(): void {
  }

}
