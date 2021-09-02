import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TicketDetailsService } from '../../services/ticket-details-service'
import { GetTicketDetailsRequest } from '../../services/models/get-ticket-details-request'
import { from } from 'rxjs';
import { DetailPreviewModel } from '../models/detail-preview-model';
import { Environment } from 'src/app/environments/environment';
import { UserProfileService } from 'src/app/services/user-profile-service';
import { UserProfileData } from 'src/app/profile/profile/models/user-profile-data';
import { DateFormatter } from 'src/app/shared/date-formatter';
import { TranslateService } from '@ngx-translate/core';



@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
  flipped = false;
  imgSrc = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtkL8GlKZ775j3f0VVgS1rU8L2LoX5UEM6fKv_eGLzeza27WYH"
  ticketId:string;
  details: DetailPreviewModel;
  pages:Array<number> = [];
  user: UserProfileData;

  eventImageUrl = Environment.serviceUrl + '/events/image?eventId=';

  flipIt() {
    this.flipped = !this.flipped;
  }


  public show:boolean = true;
  public hide:boolean = false;

  dateFormatter: DateFormatter = new DateFormatter();

  constructor(private translate:TranslateService, private userProfileService: UserProfileService, private activatedroute: ActivatedRoute, private ticketDetailsService: TicketDetailsService) { }

  ngOnInit(): void {
    this.activatedroute.params.subscribe(data => {
      console.log(data['id']);
      this.ticketId = data['id'];
    });
    this.getUserProfile();
    this.getTicketDetails();
    
  }

  toggle() {
    this.show = !this.show;
    this.hide = !this.hide;


  }

  getUserProfile(){
    this.userProfileService.getUserProfile().subscribe(response => {
      console.log(response)
      this.user = response;

    }, error => {
      console.log(error);
    });
  }

  getTicketDetails(){
    let request = new GetTicketDetailsRequest();
    request.ticketId = this.ticketId;
    this.ticketDetailsService.getTicketDetails(request).subscribe(response => {
       console.log(response);
       for (let i = 0; i < response.placeholderImages.length; i++) {
         response.placeholderImages[i] = 'data:' + response.placeholderImages[i].mimetype + ';base64,' + response.placeholderImages[i].image;
         
       }
       this.details = response;
       console.log(this.details);
        this.pages = [];
      for (let i = 0; i < response.totalPages; i++) {
          this.pages.push(i+1);
      }
    }, error => {
      console.log(error);
    });
  }
  }

