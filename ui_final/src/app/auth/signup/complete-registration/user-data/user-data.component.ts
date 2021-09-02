import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Environment } from 'src/app/environments/environment';
import { NotificationsService } from 'src/app/notifications/services/notifications.service';
import { CheckUsernameRequest } from 'src/app/services/models/check-username-request';
import { UploadProfileImageRequest } from 'src/app/services/models/upload-profile-image-request';
import { RegistrationService } from 'src/app/services/registration-service';
import { UserProfileService } from 'src/app/services/user-profile-service';
import { noWhitespaceValidator } from 'src/app/shared/Validators/no-white-space-validator';
import { UserModel } from '../user-model';


@Component({
  selector: 'app-user-data',
  templateUrl: './user-data.component.html',
  styleUrls: ['./user-data.component.css']
})
export class UserDataComponent implements OnInit {
  form: FormGroup;
  isSubmit = false;
  defaultImage: string;

  @Input() user: UserModel;
  @Input() current: number;
  @Output() currentEmitter: EventEmitter<number> = new EventEmitter<number>();

  profileImageBaseUrl = Environment.serviceUrl + '/users/profileimage';
  
  profileImageUrl = '';

  constructor(
    private formbuilder: FormBuilder, 
    private router: Router, 
    private registrationService: RegistrationService, 
    private notificationsService: NotificationsService,
    private userProfileService: UserProfileService,
    private translate: TranslateService
  ) { }


  ngOnInit(): void {
    this.userProfileService.getUserProfile().subscribe(response => {
      this.profileImageBaseUrl = this.profileImageBaseUrl + '?userId=' + response.userId;
      this.profileImageUrl = this.profileImageBaseUrl;
    })
    this.create();
  }

  create() {
    this.form = this.formbuilder.group({
      username: ['',  [Validators.required,Validators.minLength(4),Validators.maxLength(255),noWhitespaceValidator]]

    });
  }
  
  get f() { return this.form.controls; }


  uploadImage(event) {
    const request = new UploadProfileImageRequest();
    request.profileImage = event.target.files[0];
    this.registrationService.uploadProfileImage(request).subscribe(response => {
      this.profileImageUrl = this.profileImageBaseUrl + '&random=' + Math.random() ;
      this.translate.get('notifications.auth.profileImageUploaded').subscribe((data:any)=> {
        this.notificationsService.showSuccess(data);
      });
    }, err => {
      console.log(err);
    });
  }

  next() {
    this.isSubmit = true;
    if (this.form.invalid) { return; }

    let request: CheckUsernameRequest = new CheckUsernameRequest();
    request.username = this.user.username;
    request.lang = this.translate.currentLang;
    
    this.registrationService.checkUsername(request).subscribe(response => {
      if (response.isUnique) {
        this.current++;
        this.currentEmitter.emit(this.current);
      } else {
        this.translate.get('notifications.auth.usernameExists').subscribe((data:any)=> {
          this.notificationsService.showError(data);
        });
      }
    })
  }

}
