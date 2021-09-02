import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication-service';
import { VerifyEmailRequest } from '../../services/models/verify-email-request';
import { NotificationsService } from '../../notifications/services/notifications.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-verify-email',
    templateUrl: './verify-email.component.html',
    styleUrls: ['./verify-email.component.css']
})
export class VerifyEmailComponent implements OnInit {

    constructor(
        private authService: AuthenticationService,
        private route: ActivatedRoute,
        private router: Router,
        private notificationsService: NotificationsService,
        private translate: TranslateService
    ) {}

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            if (params.emailVerificationGuid) {
                let request: VerifyEmailRequest = new VerifyEmailRequest();
                request.emailVerificationGuid = params.emailVerificationGuid;
                request.lang = this.translate.currentLang;

                this.authService.verifyEmail(request).subscribe(response => {
                    this.translate.get('notifications.profile.emailAdded').subscribe((data:any)=> {
                        this.notificationsService.showSuccess(data);
                      });
                    this.router.navigateByUrl('/profile');
                }, error => {
                    this.router.navigateByUrl('/profile');
                })
            } else {
                this.router.navigateByUrl('/profile');
            }
          });
    }
}