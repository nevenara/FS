import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GetOrganizersAccountSettingRequest } from 'src/app/admin/services/models/get-organizer-account-settings-request';
import { OrganizerService } from 'src/app/admin/services/organizer-service';
import { Environment } from 'src/app/environments/environment';
import { PasswordRecoveryInitRequest } from 'src/app/services/models/password-recovery-init-request';
import { PasswordRecoveryRequest } from 'src/app/services/models/password-recovery-request';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {


  organizerId;
  imageUrl;
  email:object = {};
  
  organizerAccount: any = {companyName:"", email:""}
  constructor(private route: ActivatedRoute, private organizerService: OrganizerService) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.organizerId = params['organizer.id'];
   })
   this.organizerId = this.route.snapshot.paramMap.get('organizerId');
   this.imageUrl = Environment.serviceUrl + '/organizers/adminpanel/image'  + '?organizerId=' + this.organizerId + '&random=' + Math.random();
   this.getOrganizersAccount()
  }

  getOrganizersAccount(){

    let request = new GetOrganizersAccountSettingRequest();
    request.organizerId = this.organizerId;
    this.organizerService.getOrganizersAccountSettings(request).subscribe(response => {
      this.organizerAccount = response;
      console.log(response)
   }, err => {
    console.log(err);
  })
  }

  passwordRecovery(){
    let request = new PasswordRecoveryInitRequest();
    request.email = this.organizerAccount.email
    console.log({email: request})
    this.organizerService.passwordRecovery(request).subscribe(response => {
     console.log(response)
   }, err => {
    console.log(err);
  })
  }
}
