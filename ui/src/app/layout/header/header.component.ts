import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { UserProfileData } from 'src/app/profile/profile/models/user-profile-data';
import { UserProfileService } from 'src/app/services/user-profile-service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  public isTreeCollapsed = true;


  constructor(private userProfileService: UserProfileService) { }
  user: UserProfileData = new UserProfileData();

  ngOnInit(): void {
    this.userProfileService.getUserProfile().subscribe(response => {
      this.user = response;
      this.user.gender === "1" ? this.user.gender = "female" : this.user.gender = "male" ;
      this.user.profileImage = "data:image/jpeg;base64," + this.user.profileImage;
    }, err => {
      alert(err.error.message);
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
}
