import { Component, OnInit } from '@angular/core';
import { LinkedAccount } from '../models/linked-account';
import { LinkedAccountsService } from 'src/app/services/linked-accounts-service';
import { Environment } from 'src/app/environments/environment';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  linkedAccounts: Array<LinkedAccount> = [];
  profileImageUrl = Environment.serviceUrl + '/users/profileimage?userId=';

  loader = false;
  loadingError = false;

  constructor(private linkedAccountsService: LinkedAccountsService, public translate: TranslateService) { }

  ngOnInit(): void {
    this.loader = true;

    this.linkedAccountsService.getLinkedAccounts().subscribe(response => {
      for (let index = 0; index < response.linkedAccounts.length; index++) {
        let linkedAccount = new LinkedAccount();

        linkedAccount.id = response.linkedAccounts[index].id;
        linkedAccount.username = response.linkedAccounts[index].username;
        linkedAccount.firstname = response.linkedAccounts[index].firstname;
        linkedAccount.lastname = response.linkedAccounts[index].lastname;

        this.linkedAccounts.push(linkedAccount);
      }
      this.loader = false;
    }, err => {
      console.log(err);
      this.loadingError = true;
      this.loader = false;
    });
  }

}
