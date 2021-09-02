import { Component, OnInit } from '@angular/core';
import { ChartOptions } from 'chart.js';
import * as moment from 'moment';
import { Label } from 'ng2-charts';
import { IDateRangePickerOptions } from 'ngx-daterange';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { OrganizerService } from 'src/app/admin/services/organizer-service';
import { SearchEventOrganizersBillingRequest } from 'src/app/admin/services/models/search-events-organizers-billing-request';
import { ActivatedRoute } from '@angular/router';
import { SearchEventLocationsOrganizersBillingRequest } from 'src/app/admin/services/models/search-event-location-organizers-billing-request';
import { SearchEventNamesOrganizersBillingRequest } from 'src/app/admin/services/models/search-event-names-organizers-billing-request';
import { DateFormatter } from 'src/app/shared/date-formatter';
import { saveAs } from "file-saver";
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.css']
})
export class BillingComponent implements OnInit {
  dateOptions: IDateRangePickerOptions = {
    autoApply: true,
    //Change to be dynamic
     minDate: moment("2020-01-01T00:00:00+02:00"),
     maxDate: moment("2022-01-01T00:00:00+02:00"),
     clickOutsideAllowed: false,
     format: "DD.MM.YYYY",
     position: 'left'
  }

  searchTicketsRequest: SearchEventOrganizersBillingRequest = new SearchEventOrganizersBillingRequest();
  loader = false;
  loadingError = false;

  pieChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: 'right',
    },
    plugins: {
      datalabels: {
        formatter: this.getLabelFormating,
        color: '#fff'
      }
    },
    tooltips: {
      enabled: true,
      mode: 'single',
      callbacks: {
        label: this.getTooltipFormating
      }
    }
  };

  pieChartPlugins = [pluginDataLabels];

  pieChartLabels: Label[] = ['Ticket price: up to €30.00', 'Ticket price: €30.01 - €49.99', 'Ticket price: from €50.00'];
  pieChartData: number[] = [0, 0, 0];
  colors: Array<any> = [{
    backgroundColor: ['#14A149', '#297CE9', '#D11A1A']
  }];

  totalEvents = 0;
  totalIncomingTickets = 0;
  totalIncome = 0;

  ticketListResponse = null;

  dateFormatter: DateFormatter = new DateFormatter();

  dropdownListNames = [];
  selectedItemsNames = [];

  dropdownListLocations = [];
  selectedItemsLocations = [];

  dropdownSettings: IDropdownSettings = {};

  constructor(
    private organizerService: OrganizerService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
        this.searchTicketsRequest.organizerId = params['organizerId'];
        this.dropdownSettings = {
          singleSelection: false,
          idField: 'item_id',
          textField: 'item_text',
          selectAllText: 'Select All',
          unSelectAllText: 'UnSelect All',
          itemsShowLimit: 1,
          allowSearchFilter: true
        };

        this.searchEventNames(true);
    })
    
  }

  getFromToDate(range){
    if (range) {
      this.searchTicketsRequest.dateFrom = moment(range.split(" - ")[0], 'DD.MM.YYYY').tz("Europe/Vienna").format();
      this.searchTicketsRequest.dateTo = moment(range.split(" - ")[1], 'DD.MM.YYYY').tz("Europe/Vienna").format();
      this.searchEventNames(true);
    } else {
      this.searchTicketsRequest.dateFrom = null;
      this.searchTicketsRequest.dateTo = null;
    }
  }

  resetDate(){
    this.searchTicketsRequest.dateFrom = null;
    this.searchTicketsRequest.dateTo = null;
    this.searchEventNames(true);
  }

  unselectAllNames() {
    this.selectedItemsNames = [];
    this.searchEventLocations();
  }
  
  onSelectAllNames(items: any) {
    this.selectedItemsNames = [];
    for (let i = 0; i < this.dropdownListNames.length; i++) {
      this.selectedItemsNames.push(this.dropdownListNames[i]);
    }
    this.searchEventLocations();
  }

  unselectAllLocations() {
    this.selectedItemsLocations = [];
    this.searchEventNames();
  }
  
  onSelectAllLocations(items: any) {
    this.selectedItemsLocations = [];
    for (let i = 0; i < this.dropdownListLocations.length; i++) {
      this.selectedItemsLocations.push(this.dropdownListLocations[i]);
    }
    this.searchEventNames();
  }

  searchTickets() {
    this.searchTicketsRequest.locations = [...this.selectedItemsLocations];
    this.searchTicketsRequest.eventNames = [...this.selectedItemsNames];
    this.getTotalEvents();
    this.getTotalIncomingTickets();
    this.getIncome();
    this.getDistributionByPrice();
    this.getTicketList();
  }

  getTotalEvents() {
    this.organizerService.getTotalEvents(this.searchTicketsRequest).subscribe(response => {
      this.totalEvents = response.total;
    })
  }

  getTotalIncomingTickets() {
    this.organizerService.getTotalIncomingTickets(this.searchTicketsRequest).subscribe(response => {
      this.totalIncomingTickets = response.total;
    })
  }

  getIncome() {
    this.organizerService.getIncome(this.searchTicketsRequest).subscribe(response => {
      this.totalIncome = response.income;
    })
  }

  getDistributionByPrice() {
    this.organizerService.getDistributionByPrice(this.searchTicketsRequest).subscribe(response => {
      this.pieChartData = [response.firstCount, response.secondConut, response.thirdCount];
    })
  }

  getTicketList() {
    this.organizerService.getTicketList(this.searchTicketsRequest).subscribe(response => {
      this.ticketListResponse = response;
    })
  }

  searchEventLocations() {
    let request: SearchEventLocationsOrganizersBillingRequest = new SearchEventLocationsOrganizersBillingRequest();
    request.dateFrom = this.searchTicketsRequest.dateFrom;
    request.dateTo = this.searchTicketsRequest.dateTo;
    request.organizerId = this.searchTicketsRequest.organizerId;
    request.eventNames = [];

    this.organizerService.searchEventLocations(request).subscribe(response => {
      this.dropdownListLocations = response.locations;
      let selectedLocations = [...this.selectedItemsLocations];
      this.selectedItemsLocations = [];

      for (let i = 0; i < selectedLocations.length; i++) {
        if (this.dropdownListLocations.includes(selectedLocations[i])) {
          this.selectedItemsLocations.push(selectedLocations[i]);
        }
      }

      this.searchTickets();
    })
  }

  searchEventNames(searchLocations = false) {
    let request: SearchEventNamesOrganizersBillingRequest = new SearchEventNamesOrganizersBillingRequest();
    request.dateFrom = this.searchTicketsRequest.dateFrom;
    request.dateTo = this.searchTicketsRequest.dateTo;
    request.organizerId = this.searchTicketsRequest.organizerId;
    request.locations = [];

    this.organizerService.searchEventNames(request).subscribe(response => {
      this.dropdownListNames = response.eventNames;
      let selectedNames = [...this.selectedItemsNames];
      this.selectedItemsNames = [];

      for (let i = 0; i < selectedNames.length; i++) {
        if (this.dropdownListNames.includes(selectedNames[i])) {
          this.selectedItemsNames.push(selectedNames[i]);
        }
      }
      if (searchLocations) {
        this.searchEventLocations();
      } else {
        this.searchTickets();
      }
    })
  }

  exportExcel() {
    this.organizerService.exportBillingExcel(this.searchTicketsRequest).subscribe(response => {
      saveAs(response, 'billing');
    }, error => {
      console.log(error);
    });
  }

  exportCsv() {
    this.organizerService.exportBillingCsv(this.searchTicketsRequest).subscribe(response => {
      saveAs(response, 'billing.csv');
    }, error => {
      console.log(error);
    });
  }

  getLabelFormating(value, ctx) {
    let sum = 0;
    let dataArr = ctx.chart.data.datasets[0].data;

    for (let i = 0; i < dataArr.length; i++) {
      sum = sum + +dataArr[i];
    }

    let percentage = (value*100 / sum).toFixed(2)+"%";

    return (value*100 / sum) > 10 ? percentage : '';
  }

  getTooltipFormating(tooltipItem, data) {
    let allData = data.datasets[tooltipItem.datasetIndex].data;
    let tooltipLabel = data.labels[tooltipItem.index];
    let tooltipData = allData[tooltipItem.index];

    let sum = 0;

    for (let i = 0; i < allData.length; i++) {
      sum = sum + +allData[i];
    }

    let percentage = (+tooltipData*100 / sum).toFixed(2)+"%";

    return tooltipLabel + ": " + tooltipData + " (" + percentage + ")";
  }

}
