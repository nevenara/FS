import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Environment } from '../environments/environment';
import { AuthenticationService } from '../services/authentication-service';
import { RedirectionUrls } from './application-type';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {

  constructor(private router: Router, private authService: AuthenticationService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return this.authService.getUserTypeAsPromise().then(response => {
      if (route.data.roles.indexOf(response.userType) != -1) {
          return true;
      } else {
          this.router.navigateByUrl(RedirectionUrls[Environment.applicationType()].home);
          return false;
      }
    }, error => {
      this.router.navigateByUrl(RedirectionUrls[Environment.applicationType()].home);
      return false;
    });
  }

}
