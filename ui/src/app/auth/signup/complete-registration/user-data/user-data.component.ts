import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { RegistrationService } from 'src/app/services/registration-service';
import { UploadProfileImageRequest } from 'src/app/services/models/upload-profile-image-request';
import { UserModel } from '../user-model';

@Component({
  selector: 'app-user-data',
  templateUrl: './user-data.component.html',
  styleUrls: ['./user-data.component.css']
})
export class UserDataComponent implements OnInit {

  @Input() user: UserModel;
  @Input() current: number;
  @Output() currentEmitter: EventEmitter<number> = new EventEmitter<number>();
  
  constructor(private registrationService: RegistrationService) { }
  defaultImage: string;
  ngOnInit(): void {
    this.registrationService.getDefaultProfileImage().subscribe(response => {
      this.defaultImage = "data:image/jpeg;base64," + response.image;
    }, err => {
      alert(err.error.message);
    });
  }
  
  uploadImage(event) {
    const request = new UploadProfileImageRequest();
    request.profileImage = event.target.files[0];
    this.registrationService.uploadProfileImage(request).subscribe(response => {
      this.user.profileImage = "data:image/jpeg;base64," + response.image;
    }, err => {
      console.log(err);
    });
  }

  next() {
    this.current++;
    this.currentEmitter.emit(this.current);
  }

}
