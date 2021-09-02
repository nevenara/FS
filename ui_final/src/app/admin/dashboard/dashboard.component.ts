import { Component, OnInit, ViewChild } from '@angular/core';
import { DashboardService } from '../services/dashboard-service';
import { ChartRequest } from '../services/models/chart-request';
import { ChartOptions, ChartDataSets } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { NgbCalendar, NgbDate, NgbDateParserFormatter, NgbDatepicker, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { DateFormatter } from 'src/app/shared/date-formatter';
import * as moment from 'moment-timezone';
import { IUserContext, UserContextUtil } from 'src/app/services/models/user-context';
import { UserService } from 'src/app/services/user-service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  totalUsersRegistered: number;
  totalUsersVerified: number;
  totalUsersVerifiedInclBankAccount: number;
  totalMainAccountsWithLinkedAccounts: number;
  totalLinkedAccountsUsers: number;
  totalLinkedAccountsWithPassword: number;
  totalIncomingTickets: number;
  totalPersonalizedTickets: number;
  totalActiveOrganizers: number;

  dateFormatter: DateFormatter = new DateFormatter();


  model: NgbDateStruct;
  date: { year: number, month: number };
  hoveredDate: NgbDate | null = null;
  toggleDate1 = false;
  toggleDate2 = false;
  toggleDate3 = false;
  fromDate: NgbDate | null;
  toDate: NgbDate | null;
  toggleCustom = false;
  toggleCustom2 = false;
  startDate1;
  endDate1;
  startDate2;
  endDate2;
  startDate3;
  dateChange: { fromDate: NgbDate, toDate: NgbDate }
  endDate3;


  getUserRegisteredVsUserVerifiedRequest: ChartRequest = new ChartRequest();
  getIncomingTicketsVsPersonalizedTicketsRequest: ChartRequest = new ChartRequest();

  loader = true;
  loadError = false;

  barChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      xAxes: [{
        gridLines: {
          display: false
        }
      }],
      yAxes: [{
        ticks: {
          beginAtZero: true,
        }
      }]
    }
  };

  colors: Array<Color> = [{
    backgroundColor: '#2ec7c9'
  }, {
    backgroundColor: '#b6a2de'
  }
  ];

  usersChartLabels: Label[] = [];
  usersChartData: ChartDataSets[] = [];

  ticketsChartLabels: Label[] = [];
  ticketsChartData: ChartDataSets[] = [];

  organizersChartLabels: Label[] = [];
  organizersChartData: ChartDataSets[] = [];
  userContext: IUserContext;

  constructor(
    private userService: UserService,
    private dashboardService: DashboardService,
    private calendar: NgbCalendar,
    public formatter: NgbDateParserFormatter) {
    this.fromDate = calendar.getToday();
    this.toDate = calendar.getNext(calendar.getToday(), 'd', 10);
  }

  ngOnInit(): void {
    this.userService.getUserContext().then(n => {
      this.userContext = n;
      this.setCards();
      this.setCharts();
    });   
  }

  isInside(date: NgbDate) {
    return this.startDate1 && date.after(this.endDate1) && date.before(this.startDate1);
  }

  isRange(date: NgbDate) {
    return date.equals(this.endDate1) || (this.startDate1 && date.equals(this.startDate1)) || this.isInside(date) || this.isHovered(date);
  }
  isHovered(date: NgbDate) {
    return this.startDate1 && !this.endDate1 && this.hoveredDate && date.after(this.startDate1) && date.before(this.hoveredDate);
  }

  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
  }


  setCards() {

    if (!UserContextUtil.isOrganizer(this.userContext)) {

      //total users registered
      this.dashboardService.getTotalUsersRegistered().subscribe(response => {
        this.loader = false;
        this.totalUsersRegistered = response.total;
      }, err => {
        console.log(err);
        this.loadError = true;
        this.loader = false;
      });

      //total users verified
      this.dashboardService.getTotalUsersVerified().subscribe(response => {
        this.loader = false;
        this.totalUsersVerified = response.total;
      }, err => {
        console.log(err);
        this.loadError = true;
        this.loader = false;
      });

      //incl bank account
      this.dashboardService.getTotalUsersVerifiedInclBankAccount().subscribe(response => {
        this.loader = false;
        this.totalUsersVerifiedInclBankAccount = response.total;
      }, err => {
        console.log(err);
        this.loadError = true;
        this.loader = false;
      });

      //accounts with linked accounts
      this.dashboardService.getTotalMainAccountsWithLinkedAccounts().subscribe(response => {
        this.loader = false;
        this.totalMainAccountsWithLinkedAccounts = response.total;
      }, err => {
        console.log(err);
        this.loadError = true;
        this.loader = false;
      });

      //linked accounts
      this.dashboardService.getTotalLinkedAccountsUsers().subscribe(response => {
        this.loader = false;
        this.totalLinkedAccountsUsers = response.total;
      }, err => {
        console.log(err);
        this.loadError = true;
        this.loader = false;
      });

      //linked with passwords
      this.dashboardService.getTotalLinkedAccountsWithPassword().subscribe(response => {
        this.loader = false;
        this.totalLinkedAccountsWithPassword = response.total;
      }, err => {
        console.log(err);
        this.loadError = true;
        this.loader = false;
      });

       //active organizers
      this.dashboardService.getTotalActiveOrganizers().subscribe(response => {
        this.loader = false;
        this.totalActiveOrganizers = response.total;
      }, err => {
        console.log(err);
        this.loadError = true;
        this.loader = false;
      });
    }

    //incoming tickets
    this.dashboardService.getTotalIncomingTickets().subscribe(response => {
      this.loader = false;
      this.totalIncomingTickets = response.total;
    }, err => {
      console.log(err);
      this.loadError = true;
      this.loader = false;
    });

    //personalized tickets
    this.dashboardService.getTotalPersonalizedTickets().subscribe(response => {
      this.loader = false;
      this.totalPersonalizedTickets = response.total;
    }, err => {
      console.log(err);
      this.loadError = true;
      this.loader = false;
    });

  }

  setCharts() {
    if (!UserContextUtil.isOrganizer(this.userContext)){
      this.getUsersRegisteredVsUsersVerified(this.dateChange);
    }
    

    this.getIncomingTicketsVsPersonalizedTickets(this.dateChange);
    this.getIncomingTicketsPerOrganizer();
  }

  public getUsersRegisteredVsUsersVerified(dateChange) {
    let fromDateChange = null;
    let toDateChange = null;

    if (dateChange != undefined && dateChange.fromDate != undefined && dateChange.toDate != undefined) {
      let fromDateDay = dateChange.fromDate.day.toString();
      let toDateDay = dateChange.toDate.day.toString();
      let fromDateMonth = dateChange.fromDate.month.toString();
      let toDateMonth = dateChange.toDate.month.toString();
      if (dateChange.fromDate.day < 10) {
        fromDateDay = "0" + dateChange.fromDate.day;
      }
      if (dateChange.toDate.day < 10) {
        toDateDay = "0" + dateChange.toDate.day;
      }
      if (dateChange.fromDate.month < 10) {
        fromDateMonth = "0" + dateChange.fromDate.month;
      }
      if (dateChange.toDate.month < 10) {
        toDateMonth = "0" + dateChange.toDate.month;
      }
      fromDateChange = moment(fromDateDay  + "." + fromDateMonth + "." + dateChange.fromDate.year, "DDMMYYYY").tz("Europe/Vienna").format();
      toDateChange = moment(toDateDay + "." + toDateMonth + "." + dateChange.toDate.year, "DDMMYYYY").tz("Europe/Vienna").format();
    }

    this.getUserRegisteredVsUserVerifiedRequest.fromDate = dateChange ? fromDateChange : null;
    this.getUserRegisteredVsUserVerifiedRequest.toDate = dateChange ? toDateChange : null;
    this.dashboardService.getUsersRegisteredVsUsersVerified(this.getUserRegisteredVsUserVerifiedRequest).subscribe(response => {
      this.usersChartLabels = [];
      this.usersChartData = [];

      let index = 0;
      let data1 = [];
      let data2 = [];

      if (response.data.length == 1 && !response.data[0].year) {
        this.usersChartLabels.push(this.dateFormatter.getDate(fromDateChange) + ' - ' + this.dateFormatter.getDate(toDateChange));
        data1.push(response.data[0].usersRegisteredCount);
        data2.push(response.data[0].usersVerifiedCount);
      } else {
        for (let i = 0; i < response.data.length; i++) {
          // populate gaps
          if (index) {
            while (+this.usersChartLabels[index - 1] + 1 != response.data[i].year) {
              this.usersChartLabels.push((+this.usersChartLabels[index - 1] + 1).toString());
              data1.push(0);
              data2.push(0);
              index++;
            }
          }

          this.usersChartLabels.push(response.data[i].year);
          data1.push(response.data[i].usersRegisteredCount);
          data2.push(response.data[i].usersVerifiedCount);
          index++;
        }
      }

      // create chart data
      this.usersChartData = [
        { data: data1, label: 'Users registered', maxBarThickness: 50 },
        { data: data2, label: 'Users verified', maxBarThickness: 50 }
      ];

      if (this.usersChartLabels.length < 6) {
        this.usersChartData[0].categoryPercentage = 1.0 / 6;
        this.usersChartData[1].categoryPercentage = 1.0 / 6;
      }

    }, error => {
      console.log(error);
    });
  }

  public getIncomingTicketsVsPersonalizedTickets(dateChange) {
    //incoming tickets vs personalized tickets

    let fromDateChange = null;
    let toDateChange = null;

    if (dateChange != undefined && dateChange.fromDate != undefined && dateChange.toDate != undefined) {
      let fromDateDay = dateChange.fromDate.day.toString();
      let toDateDay = dateChange.toDate.day.toString();
      let fromDateMonth = dateChange.fromDate.month.toString();
      let toDateMonth = dateChange.toDate.month.toString();
      if (dateChange.fromDate.day < 10) {
        fromDateDay = "0" + dateChange.fromDate.day;
      }
      if (dateChange.toDate.day < 10) {
        toDateDay = "0" + dateChange.toDate.day;
      }
      if (dateChange.fromDate.month < 10) {
        fromDateMonth = "0" + dateChange.fromDate.month;
      }
      if (dateChange.toDate.month < 10) {
        toDateMonth = "0" + dateChange.toDate.month;
      }
      fromDateChange = moment(dateChange.fromDate.year + "-" + fromDateMonth + "-" + fromDateDay).tz("Europe/Vienna").format();
      toDateChange = moment(dateChange.toDate.year + "-" + toDateMonth + "-" + toDateDay).tz("Europe/Vienna").format();
    }

    this.getIncomingTicketsVsPersonalizedTicketsRequest.fromDate = dateChange ? fromDateChange : null;
    this.getIncomingTicketsVsPersonalizedTicketsRequest.toDate = dateChange ? toDateChange : null;
    this.dashboardService.getIncomingTicketsVsPersonalizedTickets(this.getIncomingTicketsVsPersonalizedTicketsRequest).subscribe(response => {
      this.ticketsChartLabels = [];
      this.ticketsChartData = [];

      let index = 0;
      let data1 = [];
      let data2 = [];

      // populate data
      if (response.data.length == 1 && !response.data[0].year) {
        this.ticketsChartLabels.push(this.dateFormatter.getDate(fromDateChange) + ' - ' + this.dateFormatter.getDate(toDateChange));
        data1.push(response.data[0].incomingTicketsCount);
        data2.push(response.data[0].personalizedTicketsCount);
      } else {
        for (let i = 0; i < response.data.length; i++) {
          // populate gaps
          if (index) {
            while (+this.ticketsChartLabels[index - 1] + 1 != response.data[i].year) {
              this.ticketsChartLabels.push((+this.ticketsChartLabels[index - 1] + 1).toString());
              data1.push(0);
              data2.push(0);
              index++;
            }
          }

          this.ticketsChartLabels.push(response.data[i].year);
          data1.push(response.data[i].incomingTicketsCount);
          data2.push(response.data[i].personalizedTicketsCount);
          index++;
        }
      }

      // create chart data
      this.ticketsChartData = [
        { data: data1, label: 'Incoming tickets', maxBarThickness: 50 },
        { data: data2, label: 'Personalized tickets', maxBarThickness: 50 }
      ];

      if (this.ticketsChartLabels.length < 6) {
        this.ticketsChartData[0].categoryPercentage = (1.0 / 6) * this.ticketsChartLabels.length;
        this.ticketsChartData[1].categoryPercentage = (1.0 / 6) * this.ticketsChartLabels.length;
      }
    }, error => {
      console.log(error);
    });
  }

  public getIncomingTicketsPerOrganizer() {
    //incoming tickets per organizer
    this.dashboardService.getIncomingTicketsPerOrganizer().subscribe(response => {
      this.organizersChartLabels = [];
      this.organizersChartData = [];

      let organizers = [];

      // get organizers list
      for (let i = 0; i < response.incomingTicketsCountPerOrganizer.length; i++) {
        if (!organizers.includes(response.incomingTicketsCountPerOrganizer[i].organizer)) {
          organizers.push(response.incomingTicketsCountPerOrganizer[i].organizer);
        }
      }

      //add labels
      for (let i = 0; i < response.incomingTicketsCountPerOrganizer.length; i++) {
        if (!this.organizersChartLabels.includes(response.incomingTicketsCountPerOrganizer[i].year + '/' + response.incomingTicketsCountPerOrganizer[i].month)) {
          this.organizersChartLabels.push(response.incomingTicketsCountPerOrganizer[i].year + '/' + response.incomingTicketsCountPerOrganizer[i].month)
        }
      }

      //add chart data 
      for (let i = 0; i < organizers.length; i++) {
        let data = [];
        for (let j = 0; j < this.organizersChartLabels.length; j++) {
          data.push(0);
        }

        if (data.length < 6) {
          this.organizersChartData.push({ data: data, label: organizers[i], maxBarThickness: 50, categoryPercentage: (1.0 / 6) * data.length });
        } else {
          this.organizersChartData.push({ data: data, label: organizers[i], maxBarThickness: 50 });
        }
      }

      //populate chart data
      for (let i = 0; i < response.incomingTicketsCountPerOrganizer.length; i++) {
        let indexOrg = organizers.indexOf(response.incomingTicketsCountPerOrganizer[i].organizer);
        let indexLabel = this.organizersChartLabels.indexOf(response.incomingTicketsCountPerOrganizer[i].year + '/' + response.incomingTicketsCountPerOrganizer[i].month);
        this.organizersChartData[indexOrg].data[indexLabel] = response.incomingTicketsCountPerOrganizer[i].incomingTicketsCount;
      }

      //add average line
      if (this.organizersChartData.length) {
        let average = [];

        for (let i = 0; i < this.organizersChartData[0].data.length; i++) {
          let sum = 0;
          for (let j = 0; j < this.organizersChartData.length; j++) {
            sum += +this.organizersChartData[j].data[i];
          }
          average.push(sum * 1.0 / this.organizersChartData.length);
        }

        this.organizersChartData.push(
          { data: average, label: 'Average', type: 'line', backgroundColor: "rgba(0,0,0,0)", borderColor: "orange", pointBackgroundColor: "orange", }
        );
      }
    }, error => {
      console.log(error);
    });
  }
}
