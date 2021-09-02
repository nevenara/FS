import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthenticationService } from 'src/app/services/authentication-service';
import { UserType } from 'src/app/services/models/user-context';

@Component({
  selector: 'app-account-layout',
  templateUrl: './account-layout.component.html',
  styleUrls: ['./account-layout.component.css']
})
export class AccountLayoutComponent implements OnInit {

  userType: UserType;
  loader = false;
  loadingError = false;

  constructor(
    private authService: AuthenticationService,
    public translate: TranslateService

  ) { }

  ngOnInit(): void {
    this.loader = true;
    this.authService.getUserType().subscribe(response => {
      this.userType = response.userType;
      this.loader = false;
    }, error => {
      this.loadingError = true;
      this.loader = false;
    })
  }

}
