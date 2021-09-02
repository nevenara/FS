import { Component, OnInit } from '@angular/core';
import { LinkedAccountsService } from 'src/app/services/linked-accounts-service';
import { ActivatedRoute, Router } from '@angular/router';
import { IdCheckLinkedAccountRequest } from 'src/app/services/models/id-check-linked-account-request';

@Component({
  selector: 'app-create1',
  templateUrl: './create1.component.html',
  styleUrls: ['./create1.component.css']
})
export class Create1Component implements OnInit {

  linkedAccountId: string;

  constructor(
    private linkedAccountsService: LinkedAccountsService, 
    private activatedroute: ActivatedRoute,
    private router: Router
  ) { 
    this.activatedroute.params.subscribe(data => {
      this.linkedAccountId = data['id'];
    })
  }

  ngOnInit(): void {
  }

  idCheck() {
    const request: IdCheckLinkedAccountRequest = new IdCheckLinkedAccountRequest();

    request.linkedAccountId = this.linkedAccountId;

    this.linkedAccountsService.idCheckLinkedAccount(request).subscribe(response => {
      console.log(response);
      this.router.navigateByUrl('/profile/list');
    }, err => {
      console.log(err);
    });;
  }

}
