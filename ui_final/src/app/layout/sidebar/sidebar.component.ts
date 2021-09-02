import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthenticationService } from 'src/app/services/authentication-service';
import { UserType } from 'src/app/services/models/user-context';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  isAdmin = false;
  public isMenuCollapsed = true;
  public isSettingCollapsed =true;
  userType: UserType;
  constructor(private router: Router, private authService: AuthenticationService, private translate: TranslateService) {
    router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.sidebarSmCollapse();
      }
      if (router.url.includes('admin')) {
        this.isAdmin = true;
      } else {
        this.isAdmin = false;
      }
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
}
