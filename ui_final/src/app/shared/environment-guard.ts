import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Environment } from '../environments/environment';
import { RedirectionUrls } from './application-type';

@Injectable({
    providedIn: "root",
})
export class EnvironmentGuard implements CanActivate {
    constructor(
        private router: Router
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (route.data.appType != Environment.applicationType()) {
            this.router.navigateByUrl(RedirectionUrls[Environment.applicationType()].home);
            return false;
        }

        return true;
    }
}