import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EventDetailsRequest } from '../services/models/event-details-request';
import { OrganizerListService } from '../services/organizer-service';
import { EventModel } from '../services/models/event-model'
import { ActivatedRoute } from '@angular/router';
import { DateFormatter } from 'src/app/shared/date-formatter';
import { Environment } from 'src/app/environments/environment';
import { UploadEventImageRequest } from '../services/models/upload-event-image-request';
import { DeleteEventImage } from '../services/models/delete-event-image-request'
import { from } from 'rxjs';
import { GetSeatImageRequest } from '../services/models/get-seat-image-request';
import { DeleteSeatImageRequest } from '../services/models/delete-seat-image-request';
import { UploadSeatImageRequest } from '../services/models/upload-seat-image-request';
import { NotificationsService } from 'src/app/notifications/services/notifications.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css'],
  providers: [EventDetailsRequest]
})
export class DetailComponent implements OnInit {
  event: Array<EventModel> = []
  closeResult: string;
  eventId;
  dateFormatter: DateFormatter = new DateFormatter();
  eventImageUrl;
  eventImage;
  image;
  seatImageUrl;


  constructor(private modalService: NgbModal, private notificationsService: NotificationsService, public request: EventDetailsRequest, public organizerListService: OrganizerListService, private route: ActivatedRoute) {}

  openBackDropCustomClass(content) {
    this.modalService.open(content, { size: 'xl', centered: true, scrollable: true, backdropClass: 'light-blue-backdrop'});
  }
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.eventId = params['eventId'];
   })
    this.eventId = this.route.snapshot.paramMap.get('eventId');
    this.eventImageUrl = Environment.serviceUrl + '/events/image?eventId=' + this.eventId + '&random=' + Math.random();
    this.seatImageUrl = Environment.serviceUrl + '/organizers/adminpanel/seatplanimage?eventId=' + this.eventId + '&random=' + Math.random()
    this.getIncomingEvents()
  }


  getIncomingEvents() {
    console.log("eventt")
    this.request.eventId = this.eventId;
    this.organizerListService.getEventDetails(this.request).subscribe(response => {
    console.log(response)
    this.event = response;
    console.log(this.event)
    }, error => {
      console.log(error);
    });
  }

  uploadEventImage(event){
    this.image = event.target.files[0];

    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);

    reader.onload = (_event) => {
      this.image = reader.result.toString();
    }
    let request = new UploadEventImageRequest;
    request.eventId = this.eventId;
    request.image = this.image;
    this.organizerListService.uploadEventImage(request).subscribe(response => {
      console.log(response)
      this.eventImageUrl = Environment.serviceUrl + '/events/image?eventId=' + this.eventId + '&random=' + Math.random();
      this.notificationsService.showSuccess("Event image has been uploaded")
      }, error => {
        console.log(error);
      });
    
  }

  deleteEventImage(){
    let request = new DeleteEventImage;
    request.eventId = this.eventId;
    this.organizerListService.deleteEventImage(request).subscribe(response => {
      console.log(response)
      this.eventImageUrl = Environment.serviceUrl + '/events/image?eventId=' + this.eventId + '&random=' + Math.random();
      this.notificationsService.showSuccess("Event image has been deleted")

      }, error => {
        console.log(error);
      });
  }

  uploadSeatImage(event){
    this.image = event.target.files[0];

    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);

    reader.onload = (_event) => {
      this.image = reader.result.toString();
    }
    let request = new UploadSeatImageRequest;
    request.eventId = this.eventId;
    request.image = this.image;
    this.organizerListService.uploadSeatImage(request).subscribe(response => {
      console.log(response)
      this.seatImageUrl = Environment.serviceUrl + '/organizers/adminpanel/seatplanimage?eventId=' + this.eventId + '&random=' + Math.random()
      this.notificationsService.showSuccess("Seats image has been uploaded")
    }, error => {
        console.log(error);
      });
  }
  
  deleteSeatImage(){
    let request = new DeleteSeatImageRequest;
    request.eventId = this.eventId;
    this.organizerListService.deleteSeatsImage(request).subscribe(response => {
      console.log(response)
      this.seatImageUrl = Environment.serviceUrl + '/organizers/adminpanel/seatplanimage?eventId=' + this.eventId + '&random=' + Math.random()
      this.notificationsService.showSuccess("Seats image has been deleted")
      }, error => {
        console.log(error);
      });
  }
}



