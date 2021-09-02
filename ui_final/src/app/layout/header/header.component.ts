import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { UserStatus } from 'src/app/admin/models/user-status';
import { GetAccountBalanceRequest } from 'src/app/admin/services/models/get-account-balance-request';
import { Environment } from 'src/app/environments/environment';
import { UserProfileData } from 'src/app/profile/profile/models/user-profile-data';
import { AuthenticationService } from 'src/app/services/authentication-service';
import { UserType } from 'src/app/services/models/user-context';
import { UserProfileService } from 'src/app/services/user-profile-service';
import { UpdateHeaderProfileImageService } from './services/update-header-profile-image.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  public isTreeCollapsed = true;
  balance = 0;
  hasBalance = false;
 
  constructor(
    private userProfileService: UserProfileService,
    private router: Router,
    private authService: AuthenticationService,
    public translate: TranslateService,
    public updateHeaderProfileImageService: UpdateHeaderProfileImageService
  ) 
  { }

  user: UserProfileData = new UserProfileData();

  profileImageUrl = '';
  profileImageBaseUrl = Environment.serviceUrl + '/users/profileimage' 

  updateHeaderProfileImageSubscription: Subscription;

  ngOnInit(): void {

    this.updateHeaderProfileImageSubscription = this.updateHeaderProfileImageService.updateProfileImage$.subscribe(() => {
      this.profileImageUrl = this.profileImageBaseUrl + '&random=' + Math.random();
    });

    console.log('HEADER COMPONENT..')
    this.userProfileService.getUserProfile().subscribe(response => {
      if (response.status === 'EmailVerified') {
        this.router.navigateByUrl('/auth/signup/completeregistration');
      }

      this.user = response;

      this.profileImageBaseUrl = this.profileImageBaseUrl + '?header=true&userId=' + this.user.userId;
      this.profileImageUrl = this.profileImageBaseUrl;
      
      this.user.gender === "1" ? this.user.gender = "female" : this.user.gender = "male" ;

      if (this.user.userType == UserType.MainAccount && this.user.status != UserStatus.Registered) {
        let request: GetAccountBalanceRequest = new GetAccountBalanceRequest();
        request.userId = this.user.userId;

        this.userProfileService.getAccountBalance(request).subscribe(response => {
          this.balance = 0;

          for (let i = 0; i < response.available.length; i++) {
            this.balance = this.balance + response.available[i].amount;
          }

          this.hasBalance = true;
        })
      }
    }, err => {
      
    });
  }

  ngOnDestroy() {
    this.updateHeaderProfileImageSubscription.unsubscribe();
  }

  sidebarLgCollapse() {
    const element = document.getElementsByTagName('body')[0];
    if (element.classList.contains('sidebar-xs')) {
      element.classList.remove('sidebar-xs');
    } else {
      element.classList.add('sidebar-xs');
    }


  }

  sidebarSmCollapse() {
    const element = document.getElementsByTagName('body')[0];
    if (element.classList.contains('sidebar-mobile-main')) {
      element.classList.remove('sidebar-mobile-main');
    } else {
      element.classList.add('sidebar-mobile-main');
    }
  }

  logout() {
    this.authService.logout().subscribe(response => {
      console.log(response);
      this.router.navigateByUrl('/auth');
    }, err => {
      console.log(err);
    });
  }

  useLang(event) {
    this.translate.use(event.value);
  }
}
