import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbNav } from '@ng-bootstrap/ng-bootstrap';
import { UserDetailsPreview } from 'src/app/admin/models/user-details-preview';
import { GetAdminPanelUserDetailsRequest } from 'src/app/admin/services/models/get-admin-panel-user-details-request';
import { UserService } from 'src/app/admin/services/user-service';

@Component({
  selector: 'app-detail-layout',
  templateUrl: './detail-layout.component.html',
  styleUrls: ['./detail-layout.component.css']
})
export class DetailLayoutComponent implements OnInit, AfterViewInit {
  @ViewChild(NgbNav) ngbTabset: NgbNav;
  
  loader = false;
  loadingError = false;
  user: UserDetailsPreview = new UserDetailsPreview();
  userId: string;
  selectedIdParam;

  constructor(
    private route: ActivatedRoute, 
    private cdr: ChangeDetectorRef,
    private userService: UserService
  ) { 
    this.user = null;
    this.route.params.subscribe(data => {
      this.user = null;
      console.log(data['userId']);
      this.userId = data['userId'];
      this.getUserDetails();
    });
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    
  }

  getUserDetails(redirect = true){
    this.loader = true;
    let request = new GetAdminPanelUserDetailsRequest();
    request.userId = this.userId;

    this.userService.getAdminPanelUserDetails(request).subscribe(response => {
       console.log(response);
       this.loader = false;
       this.user = response;
       if (redirect) {
          this.route.queryParams.subscribe(params => {
            if (params.type && +params.type >= 1 && +params.type <= 3) {
              this.ngbTabset.select(+params.type);
            } else if (params.uuid) {
              this.ngbTabset.select(3)
            } else {
              this.ngbTabset.select(1);
            }
          });
       }
       
      this.cdr.detectChanges();
    }, error => {
      console.log(error);
      this.loadingError = true;
      this.loader = false;
    });
  }
}
