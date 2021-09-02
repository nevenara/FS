import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Calendar, CalendarOptions, FullCalendarComponent } from '@fullcalendar/angular';
import { GetEventsService } from '../services/get-events-service'
import { GetEventsByDayRequest } from '../services/models/get-events-by-day-request';
import { GetEventsByMonthRequest } from '../services/models/get-events-by-month-request';
import { GetEventsByWeekRequest } from '../services/models/get-events-by-week-request';
import { EventCalendarModel } from '../services/models/event-calendar-model'
import { formatDate } from '@fullcalendar/angular';
import { Environment } from '../environments/environment';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit, AfterViewInit {
  @ViewChild('calendar') calendarComponent: FullCalendarComponent;
  month: number;
  year: number;
  fromDate: Date;
  toDate: Date;
  date: Date;
  details: EventCalendarModel;
  public isCollapsed = false;
  FormattedDate;
  calendarApi;
  currentView;
  calendarNew;
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
        events: [
      { title: 'event 1', date: '2020-07-01' },
      { title: 'event 2', date: '2020-07-02' }
    ],
    customButtons: {
      export: {
        text: 'Export Calendar as .ics',
       
        click: () => {
          this.exportEvents();
        }
      }
    },
    datesSet: this.handleDateChange.bind(this),
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,dayGridWeek,dayGridDay'
    },
    footerToolbar: {
      right: 'export'
    }
  };

  handleDateChange(){
    if(this.calendarApi != undefined){
      this.currentView = this.calendarApi.currentData.currentViewType;
      console.log("month is: ")
      if(this.currentView == "dayGridMonth"){
        this.halndleCalendarChange()
        this.getEventsByMonth();
      }
      if(this.currentView == "dayGridWeek"){
        this.fromDate = this.calendarApi.currentData.dateProfile.activeRange.start
        this.toDate = this.calendarApi.currentData.dateProfile.activeRange.end
        this.halndleCalendarChange()
        this.getEventsByWeek();
      }
      if(this.currentView == "dayGridDay"){
        this.date = this.calendarApi.currentData.currentDate
        this.halndleCalendarChange()
        this.getEventsByDay();
      }
    }
    
  }

  constructor(private getEventsService: GetEventsService, private translate: TranslateService) { }

  ngOnInit(): void {
    
  }


  ngAfterViewInit() {
    this.halndleCalendarChange()
    this.getEventsByMonth();
  }

  halndleCalendarChange(){
    this.calendarApi = this.calendarComponent.getApi()
    this.FormattedDate = formatDate(this.calendarApi.currentData.currentDate, {
      month: 'numeric',
      year: 'numeric',
      day: 'numeric'
    });
    this.month = this.FormattedDate.toString().split('/')[0]
    this.year = this.FormattedDate.toString().split('/')[2]
    this.currentView = this.calendarApi.currentData.currentViewType;
  }

  getEventsByMonth() {
    let request = new GetEventsByMonthRequest();
    request.month = this.month;
    request.year = this.year;
    this.getEventsService.getEventsByMonth(request).subscribe(response => {
      this.details = response;
      for (let i = 0; i < response.events.length; i++) {
        this.calendarOptions.events = [{ title: response.events[i].eventName, date: ((response.events[i].date.toString()).split('T')[0]) }];
      }
      console.log(this.details);
    }, error => {
      console.log(error);
    });
  }
  getEventsByWeek() {
    let request = new GetEventsByWeekRequest();
    request.fromDate = this.fromDate;
    request.toDate = this.toDate;
    this.getEventsService.getEventsByWeek(request).subscribe(response => {
      this.details = response;
      for (let i = 0; i < response.events.length; i++) {
        this.calendarOptions.events = [{ title: response.events[i].eventName, date: ((response.events[i].date.toString()).split('T')[0]) }];
      }
      console.log(this.details);
    }, error => {
      console.log(error);
    });
  }
  getEventsByDay() {
    let request = new GetEventsByDayRequest();
    request.date = this.date;
    this.getEventsService.getEventsByDay(request).subscribe(response => {
      this.details = response;
      for (let i = 0; i < response.events.length; i++) {
        this.calendarOptions.events = [{ title: response.events[i].eventName, date: ((response.events[i].date.toString()).split('T')[0]) }];
      }
      console.log(this.details);
    }, error => {
      console.log(error);
    });
  }
  exportEvents(){
    const link = document.createElement('a');
  // link.setAttribute('target', '_blank');
    link.setAttribute('href', Environment.serviceUrl + '/eventcalendar/exportcalendar');
    link.setAttribute('download', `FansafeCalendarEvents.ics`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    this.getEventsService.exportEvents()
  }

}
