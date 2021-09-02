import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class OSidebarComponent implements OnInit {
  public isMenuCollapsed = true;
  public isSettingCollapsed =true;
  public  isTicketsCollapsed = true ;
  public isOrgnaizationCollapsed = true
  constructor(private router: Router) {
    router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.sidebarSmCollapse();
      }

    });
  }
  ngOnInit(): void {
  }
  sidebarSmCollapse() {

    const element = document.getElementsByTagName('body')[0];

      element.classList.remove('sidebar-mobile-main');


  }
}
