import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  isAdmin = false;
  constructor(private router: Router) {
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
  }
  sidebarSmCollapse() {

    const element = document.getElementsByTagName('body')[0];

      element.classList.remove('sidebar-mobile-main');


  }
}
