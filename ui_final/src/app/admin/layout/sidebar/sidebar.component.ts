import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication-service';
import { UserType } from 'src/app/services/models/user-context';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class ASidebarComponent implements OnInit {
  public isUserCollapsed = false;
  public isSettingCollapsed =false;
  public isOrganizerCollapsed = false;
  userType: UserType;

  constructor(private router: Router, private authService: AuthenticationService) {
    router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.sidebarSmCollapse();
      }
      // here get the router.url
      // check if it is not a user route collapse the
      //isUserCollapsed = true


      // check if it is not a setting route collapse the
      //isSettingCollapsed = true
      //isTicketsCollapsed
      // isOrganizerCollapsed

    });
  }
  ngOnInit(): void {
    this.authService.getUserType().subscribe(response => {
      this.userType = response.userType;
    })
  }
  sidebarSmCollapse() {

    const element = document.getElementsByTagName('body')[0];

      element.classList.remove('sidebar-mobile-main');


  }
  onClickUser() {
    this.isUserCollapsed = !this.isUserCollapsed;
    this.isSettingCollapsed = false;
    this.isOrganizerCollapsed = false;
  }
  onClickSetting() {
    this.isUserCollapsed = false;
    this.isSettingCollapsed = !this.isSettingCollapsed;
    this.isOrganizerCollapsed = false;
  }
  onClickOrganizer() {
    this.isUserCollapsed = false;
    this.isSettingCollapsed = false;
    this.isOrganizerCollapsed = !this.isOrganizerCollapsed;
  }
  onClickOther() {
    this.isUserCollapsed = false;
    this.isSettingCollapsed = false;
    this.isOrganizerCollapsed = false;
  }
}
