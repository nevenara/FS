import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {


  show = 1;
  idVerificationModal;
  closeResult: string;
  name = 'Angular 6';
  htmlContent = '';

  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    toolbarHiddenButtons: [
      ['bold']
      ],
    customClasses: [
      {
        name: "quote",
        class: "quote",
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: "titleText",
        class: "titleText",
        tag: "h1",
      },
    ]
  };
  day = [
    {id: 1, name: '1'}, {id: 2, name: '2'}, {id: 3, name: '3'}, {id: 4, name: '4'}, {id: 5, name: '5'},
    {id: 6, name: '5'}, {id: 7, name: '7'}, {id: 8, name: '8'}, {id: 9, name: '9'}, {id: 10, name: '10'},
    {id: 11, name: '11'}, {id: 12, name: '12'}, {id: 13, name: '13'}, {id: 14, name: '14'}, {id: 15, name: '15'},
     {id: 16, name: '16'}, {id: 17, name: '17'}, {id: 18, name: '18'}, {id: 19, name: '19'}, {id: 20, name: '20'},
    {id: 21, name: '21'}, {id: 22, name: '22'}, {id: 23, name: '23'}, {id: 24, name: '24'}, {id: 25, name: '25'},
    {id: 26, name: '126'}, {id: 27, name: '27'}, {id: 28, name: '28'}, {id: 29, name: '29'}, {id: 30, name: '30'},
    {id: 31, name: '31'},
  ];
  constructor(private modalService: NgbModal) {}

  next() {
    this.show ++;
 
    if(this.show >= 4) {
      this.show = 1;
    }
    console.log(this.show)
  }

  previous() {
    this.show --;

    if(this.show < 1) {
        this.show = 3;
    }
  }

  ngOnInit(): void {
  }
  open(content) {
    this.modalService.open(content, { size: 'lg' });
  }

  openIdVerificationComponent(idcontent) {
    this.show = 1;
    this.idVerificationModal = idcontent;
    console.log(idcontent);
    this.modalService.open(idcontent, { size: 'xl' }).result.then((result) => {  
    }, (reason) => {
      console.log("error")
    });
  }

  }

