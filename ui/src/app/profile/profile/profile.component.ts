import { Component, OnInit } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { UpdateUserProfileRequest } from 'src/app/services/models/update-user-profile-request';
import { UploadProfileImageRequest } from 'src/app/services/models/upload-profile-image-request';
import { RegistrationService } from 'src/app/services/registration-service';
import { UserProfileService } from 'src/app/services/user-profile-service';
import { UserProfileData } from './models/user-profile-data';
import { AdditionalEmailsService } from 'src/app/services/additional-emails-service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  closeResult = '';
  user: UserProfileData = new UserProfileData();
  newEmail: string = '';
  newStandardEmail: string = '';

  countries = [
    'Afghanistan','Albania','Algeria','Andorra','Angola','Antigua and Barbuda','Argentina','Armenia','Australia','Austria','Austrian Empire','Azerbaijan',
    'Baden*','Bahamas, The','Bahrain','Bangladesh','Barbados','Bavaria*','Belarus','Belgium','Belize','Benin (Dahomey)',
    'Bolivia','Bosnia and Herzegovina','Botswana','Brazil','Brunei','Brunswick and Lüneburg','Bulgaria',
    'Burkina Faso (Upper Volta)','Burma','Burundi','Cabo Verde','Cambodia','Cameroon','Canada','Cayman Islands, The Central African Republic',
    'Central American Federation*','Chad','Chile','China','Colombia','Comoros','Congo Free State, The','Costa Rica','Cote d’Ivoire (Ivory Coast)','Croatia','Cuba','Cyprus','Czechia','Czechoslovakia','','','','','','','','',
  ];
  
  constructor(private modalService: NgbModal,
    private userProfileService: UserProfileService,
    private registrationService: RegistrationService,
    private additionalEmailsService: AdditionalEmailsService) {     }


  open(content) {
    this.modalService.open(content,  { centered: true }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  updateUserProfile(){
    let request = new UpdateUserProfileRequest();
    request.address = this.user.address;
    request.city = this.user.city;
    request.country = this.user.country;
    request.phone = this.user.phone;
    request.postCode = this.user.postCode;

    this.userProfileService.updateUserProfile(request).subscribe(response => {
      console.log(response);
    }, err=> {
      alert(err.error.message);
    });
  }

  addAdditionalEmail(){
    this.additionalEmailsService.addAdditionalEmail({email: this.newEmail}).subscribe(response => {
      
      this.user.additionalEmails.push(response);
      this.newEmail = '';

      console.log(this.user.additionalEmails);
    }, err => {
      alert(err.error.message);
    })
  }
  
  setStandardEmail(email){
    this.newStandardEmail = email;
  }

  useAsStandardEmail(password){
    this.additionalEmailsService.useAsStandardEmail({email: this.newStandardEmail, password: password}).subscribe(response => {
      const index = this.user.additionalEmails.findIndex(x => x['email'] === this.newStandardEmail);
      if (index > -1) {
        this.user.additionalEmails.splice(index, 1);
        this.user.additionalEmails.push({email: this.user.email, isVerified:true});
        this.user.email = this.newStandardEmail;
      }

    }, err => {
      alert(err.error.message);
    })
  }

  deleteAdditionalEmail(email){
    this.additionalEmailsService.deleteAdditionalEmail({email: email}).subscribe(response => {
      const index = this.user.additionalEmails.findIndex(x => x['email'] === email);
      if (index > -1) {
        this.user.additionalEmails.splice(index, 1);
      }

    }, err => {
      alert(err.error.message);
    })
  }

  uploadImage(event) {
    const request = new UploadProfileImageRequest();
    request.profileImage = event.target.files[0];
    this.registrationService.uploadProfileImage(request).subscribe(response => {
      this.user.profileImage = "data:image/jpeg;base64," + response.image;
    }, err => {
      alert(err.error.message);
    });
  }

  ngOnInit(): void {
    this.userProfileService.getUserProfile().subscribe(response => {
      this.user = response;
      this.user.gender === "1" ? this.user.gender = "female" : this.user.gender = "male" ;
      this.user.profileImage = "data:image/jpeg;base64," + this.user.profileImage;
    }, err => {
      alert(err.error.message);
    });
  }

}
