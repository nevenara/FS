import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbCalendar, NgbDate, NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-calendar',
    templateUrl: './calendar.component.html',
    styleUrls: ['./calendar.component.css']
})
export class CustomCalendar implements OnInit {

    @Input() startDate;
    @Input() endDate;
    model: NgbDateStruct;
    date: { year: number, month: number };
    hoveredDate: NgbDate | null = null;
    toggleDate1 = false;
    toggleCustom = false;
    startDateInput = "";
    endDateInput = "";

    dateChange: object 
    @Output() dateChangedEmitter: EventEmitter<Object> = new EventEmitter<Object>();

    constructor(public calendar: NgbCalendar, public formatter: NgbDateParserFormatter) {

    }


    onDateSelection(date: NgbDate) {
        if (!this.endDate && !this.startDate) {
            this.startDate = date;
        } else if (this.startDate && !this.endDate && date && date.after(this.startDate)) {
            this.endDate = date;
        } else {
            this.endDate = null;
            this.startDate = date;
        }
         
        console.log(this.startDate)
        console.log(this.endDate)
        
        
        this.dateChange = {toDate:this.endDate, fromDate:this.startDate};
        console.log("bla")
        this.dateChangedEmitter.emit(this.dateChange)
    }



    isInside(date: NgbDate) {
        return this.startDate && date.after(this.endDate) && date.before(this.startDate);
      }
    
      isRange(date: NgbDate) {
        return date.equals(this.endDate) || (this.startDate && date.equals(this.startDate)) || this.isInside(date) || this.isHovered(date);
      }
      isHovered(date: NgbDate) {
        return this.startDate && !this.endDate && this.hoveredDate && date.after(this.startDate) && date.before(this.hoveredDate);
      }
    
      validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
        const parsed = this.formatter.parse(input);
        return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
      }

      selectToday(){
        this.model = this.calendar.getToday();
        this.startDate = this.model;
        this.endDate = this.model       
       

        this.dateChange = {fromDate:this.startDate, toDate:this.endDate};

        console.log("bla")
        this.dateChangedEmitter.emit(this.dateChange)
       
      }

      selectYesterday(){
        this.endDate = this.calendar.getToday()
        this.startDate = this.calendar.getPrev(this.calendar.getToday(), 'd', 1);
        this.dateChange = {fromDate:this.startDate, toDate:this.endDate};
        console.log("bla")
        this.dateChangedEmitter.emit(this.dateChange)
        this.formatDate()

       
      }

    selectSevenDaysAgo() {
        this.startDate = this.calendar.getPrev(this.calendar.getToday(), 'd', 7)
        this.endDate = this.calendar.getToday()
        console.log(this.startDate)
        console.log(this.endDate)
        this.dateChange = {fromDate:this.startDate, toDate:this.endDate};
        console.log("bla")
        this.dateChangedEmitter.emit(this.dateChange)
        this.formatDate()

    }

    selectThirtyDaysAgo() {
      
        this.startDate = this.calendar.getPrev(this.calendar.getToday(), 'd', 30)
        this.endDate = this.calendar.getToday()
        console.log(this.endDate.year)
        console.log(this.startDate)
        console.log(this.endDate)
        this.dateChange = {fromDate:this.startDate, toDate:this.endDate};
        console.log("bla")
        this.dateChangedEmitter.emit(this.dateChange)
        this.formatDate()

    }

    selectThisMonth() {
        this.startDate = new NgbDate(this.calendar.getToday().year, this.calendar.getToday().month, 1);
        this.endDate = new NgbDate(this.calendar.getToday().year, this.calendar.getToday().month, this.calendar.getToday().day);
        console.log(this.startDate)
        console.log(this.endDate)
        this.dateChange = {fromDate:this.startDate, toDate:this.endDate};
        console.log("bla")
        this.dateChangedEmitter.emit(this.dateChange)
        this.formatDate()


    }

    selectLastMonth() {
        let now = new Date();
        let monthFormatted;
        let yearFormatted;
        if(this.calendar.getToday().month - 1 < 1){
          monthFormatted = 12
          yearFormatted = this.calendar.getToday().year - 1;
        }
        else{
          monthFormatted = this.calendar.getToday().month - 1
          yearFormatted = this.calendar.getToday().year
        }
        this.startDate = new NgbDate(yearFormatted, monthFormatted, 1);
        let year = now.getFullYear();
        let month = now.getMonth();
        let day = new Date(year, month, 0).getDate();
        this.endDate = { year: year, month: month + 1, day: day };
        if(this.startDate.month == "12"){
          this.endDate.month = "12"
          this.endDate.year = this.endDate.year - 1
        }
        console.log(this.startDate)
        console.log(this.endDate)
        this.dateChange = {fromDate:this.startDate, toDate:this.endDate};
        console.log("bla")
        this.dateChangedEmitter.emit(this.dateChange)
        this.formatDate()

    }

    formatDate(){

      if(this.startDate.month){
        if(this.startDate.month < 10){
          this.startDate.month = "0" + this.startDate.month
        }
      }
      if(this.startDate.day){
        if(this.startDate.day < 10){
          this.startDate.day = "0" + this.startDate.day
        }
      }
      if(this.endDate.month){
        if(this.endDate.month < 10){
          this.endDate.month = "0" + this.endDate.month
        }
      }
      if(this.endDate.day){
        if(this.endDate.day < 10){
          this.endDate.day = "0" + this.endDate.day
        }
      }

      console.log("date is ")
      console.log(this.startDate)
      console.log(this.endDate)

    }

    validateInputStart(){
      if(!this.startDateInput){
        this.startDateInput = ""
      }
      let regex = new RegExp("^\\s*(3[01]|[12][0-9]|0?[1-9])\\.(1[012]|0?[1-9])\\.((?:19|20)\\d{2})\\s*$")
      if(this.startDateInput.match(regex)){
        this.startDate = new NgbDate(+this.startDateInput.split(".")[2], +this.startDateInput.split(".")[1], +this.startDateInput.split(".")[0]);
        this.dateChange = {fromDate:this.startDate, toDate:this.endDate};
        console.log(this.startDateInput)
        this.dateChangedEmitter.emit(this.dateChange)
      }
    }
    validateInputEnd(){
      if(!this.endDateInput){
        this.endDateInput = ""
      }
      let regex = new RegExp("^\\s*(3[01]|[12][0-9]|0?[1-9])\\.(1[012]|0?[1-9])\\.((?:19|20)\\d{2})\\s*$")
      if(this.endDateInput.match(regex)){
        this.endDate = new NgbDate(+this.endDateInput.split(".")[2], +this.endDateInput.split(".")[1], +this.endDateInput.split(".")[0]);
        this.dateChange = {fromDate:this.startDate, toDate:this.endDate};
        this.dateChangedEmitter.emit(this.dateChange)
      }
    }

    ngOnInit() {


    }
}
