import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbNav } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { AuthenticationService } from 'src/app/services/authentication-service';
import { UserType } from 'src/app/services/models/user-context';

@Component({
  selector: 'app-profile-layout',
  templateUrl: './profile-layout.component.html',
  styleUrls: ['./profile-layout.component.css']
})
export class ProfileLayoutComponent implements OnInit, AfterViewInit {

  @ViewChild(NgbNav) ngbTabset: NgbNav;
  userType: UserType;

  constructor(public route: ActivatedRoute, private cdr: ChangeDetectorRef, private authService: AuthenticationService, public translate: TranslateService
    ) { 
    
  }

  ngOnInit() {
    
  }

  ngAfterViewInit(): void {
    this.authService.getUserType().subscribe(response => {
      this.userType = response.userType;
      if (response.userType == UserType.MainAccount) {
        this.route.queryParams.subscribe(params => {
          if (params.type && +params.type == 2) {
            this.ngbTabset.select(2);
          } 
    
          console.log(window.location.pathname);
    
          if (window.location.pathname.split('/').pop() != 'profile' && window.location.pathname.split('/').pop() != 'verifyEmail') {
            this.ngbTabset.select(2);
          }
          
          this.cdr.detectChanges();
        });
      }
    })
  }

}
