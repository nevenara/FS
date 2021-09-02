import { Component, OnInit } from '@angular/core';
import { ChartOptions } from 'chart.js';
import { Label } from 'ng2-charts';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { DashboardService } from '../services/dashboard-service';
import 'chartjs-plugin-colorschemes';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  pieChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: 'right',
    },
    plugins: {
      datalabels: {
        formatter: this.getLabelFormating,
        color: '#fff'
      },
      colorschemes: {
        scheme: 'brewer.PastelOne3',
        override: true
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

  incomingTicketsLabel: Label[] = [];
  incomingTicketsData: number[] = [];

  personalizedTicketsLabel: Label[] = [];
  personalizedTicketsData: number[] = [];

  constructor(
    private dashboardService: DashboardService
  ) { }

  ngOnInit(): void {
    this.getIncomingTickets();
    this.getPersonalizedTickets();
  }

  getIncomingTickets() {
    this.dashboardService.getIncomingTicketsPerEvent().subscribe(response => {
      this.incomingTicketsLabel = [];
      this.incomingTicketsData = [];

      for (let i = 0; i < response.data.length; i++) {
        this.incomingTicketsLabel.push(response.data[i].eventName); 
        this.incomingTicketsData.push(response.data[i].totalIncomingTickets);  
      }
    }, error => {
      console.log(error);
    });
  }

  getPersonalizedTickets() {
    this.dashboardService.getPersonalizedTicketsPerEvent().subscribe(response => {
      this.personalizedTicketsLabel = [];
      this.personalizedTicketsData = [];

      for (let i = 0; i < response.data.length; i++) {
        this.personalizedTicketsLabel.push(response.data[i].eventName); 
        this.personalizedTicketsData.push(response.data[i].totalPersonalizedTickets);  
      }
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
