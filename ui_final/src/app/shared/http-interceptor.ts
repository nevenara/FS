import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse
} from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { NotificationsService } from '../notifications/services/notifications.service';
import { Environment } from '../environments/environment';
import { RedirectionUrls } from './application-type';

/** Inject With Credentials into the request */
@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {

  constructor(
    private router: Router,
    private notificationsService: NotificationsService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {

    console.log("interceptor: " + req.url);
    req = req.clone({
      withCredentials: true
    });

    const observable = next.handle(req);

    return observable.pipe(

      // retry(1),

      catchError((error: HttpErrorResponse) => {

        let errorMessage = '';

        if (error.error.message) {

          // client-side error

          errorMessage = error.error.message;

        } else {

          // server-side error

          errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }

        if (error.status == 403) {
          this.router.navigate([RedirectionUrls[Environment.applicationType()].auth]);
        }

        this.notificationsService.showError(errorMessage);

        return throwError(errorMessage);

      }));
  }
}