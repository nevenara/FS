import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-id-verification',
  templateUrl: './id-verification.component.html',
  styleUrls: ['./../personalization/detail/detail.component.css','./id-verification.component.css']
})
export class IdVerificationComponent implements OnInit {

  selectedId = 1;
  @Input() show: number;

  ngOnInit(): void {

  }


}
