import { Component, OnInit } from '@angular/core';
import { LinkedAccount } from '../models/linked-account';
import { LinkedAccountsService } from 'src/app/services/linked-accounts-service';
import { listenBySelector } from '@fullcalendar/angular';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  linkedAccounts: Array<LinkedAccount> = [];

  constructor(private linkedAccountsService: LinkedAccountsService) { }

  ngOnInit(): void {
    this.linkedAccountsService.getLinkedAccounts().subscribe(response => {
      for (let index = 0; index < response.linkedAccounts.length; index++) {
        let linkedAccount = new LinkedAccount();

        linkedAccount.id = response.linkedAccounts[index].id;
        linkedAccount.username = response.linkedAccounts[index].username;
        linkedAccount.firstname = response.linkedAccounts[index].firstname;
        linkedAccount.lastname = response.linkedAccounts[index].lastname;
        linkedAccount.profileImage = "data:image/jpeg;base64," + response.linkedAccounts[index].profileImage;

        this.linkedAccounts.push(linkedAccount);
      }
    }, err => {
      console.log(err);
    });
  }

}
