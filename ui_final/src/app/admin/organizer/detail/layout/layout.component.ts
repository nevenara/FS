import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication-service';
import { UserType } from 'src/app/services/models/user-context';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {

  superAdmin = false;

  constructor(private authService: AuthenticationService) { }

  ngOnInit(): void {
    this.authService.getUserContext().subscribe(response => {
      if (response.userType == UserType.SuperAdmin) {
        this.superAdmin = true;
      }
    })
  }

}
