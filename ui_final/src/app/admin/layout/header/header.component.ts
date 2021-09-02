import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Environment } from 'src/app/environments/environment';
import { UserProfileData } from 'src/app/profile/profile/models/user-profile-data';
import { AuthenticationService } from 'src/app/services/authentication-service';
import { UserProfileService } from 'src/app/services/user-profile-service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class AHeaderComponent implements OnInit {
  public isTreeCollapsed = true;

  profileImageUrl = '';
  profileImageBaseUrl = Environment.serviceUrl + '/users/profileimage' 

  user: UserProfileData = new UserProfileData();

  constructor(private router: Router,
    private userProfileService: UserProfileService,
    private authService: AuthenticationService) { }

  ngOnInit(): void {
    this.userProfileService.getUserProfile().subscribe(response => {
      this.user = response;
      this.profileImageUrl = this.profileImageBaseUrl + '?header=true&userId=' + this.user.userId;
    }, err => {
      
    });
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
      this.router.navigateByUrl('/admin/auth');
    }, err => {
      console.log(err);
    });
  }
}
