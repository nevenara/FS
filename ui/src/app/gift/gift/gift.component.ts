import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-gift',
  templateUrl: './gift.component.html',
  styleUrls: ['./gift.component.css']
})
export class GiftComponent implements OnInit {
  public isTreeCollapsed = true;
  closeResult: string;
  day = [
    {id: 1, name: '1'}, {id: 2, name: '2'}, {id: 3, name: '3'}, {id: 4, name: '4'}, {id: 5, name: '5'},
    {id: 6, name: '5'}, {id: 7, name: '7'}, {id: 8, name: '8'}, {id: 9, name: '9'}, {id: 10, name: '10'},
    {id: 11, name: '11'}, {id: 12, name: '12'}, {id: 13, name: '13'}, {id: 14, name: '14'}, {id: 15, name: '15'},
     {id: 16, name: '16'}, {id: 17, name: '17'}, {id: 18, name: '18'}, {id: 19, name: '19'}, {id: 20, name: '20'},
    {id: 21, name: '21'}, {id: 22, name: '22'}, {id: 23, name: '23'}, {id: 24, name: '24'}, {id: 25, name: '25'},
    {id: 26, name: '126'}, {id: 27, name: '27'}, {id: 28, name: '28'}, {id: 29, name: '29'}, {id: 30, name: '30'},
    {id: 31, name: '31'},
  ];



  name = 'Angular 6';
  htmlContent = '';

  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '12rem',
    minHeight: '12rem',
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
  dropdownList: { item_id: number; item_text: string; }[];
  selectedItems: { item_id: number; item_text: string; }[];
  dropdownSettings: { singleSelection: boolean; idField: string; textField: string; selectAllText: string; unSelectAllText: string; itemsShowLimit: number; allowSearchFilter: boolean; };

  constructor(private modalService: NgbModal) {}

  ngOnInit(): void {
    this.dropdownList = [
      { item_id: 1, item_text: 'Concerts' },
      { item_id: 2, item_text: 'Culture' },
      { item_id: 3, item_text: 'Sports' },
      { item_id: 4, item_text: 'Musical & Show' },
      { item_id: 5, item_text: 'Cabaret & Comedy' }

    ];
    this.selectedItems = [
      { item_id: 3, item_text: 'Culture' },
      { item_id: 4, item_text: 'Musical & Show' }
    ];
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 2,
      allowSearchFilter: true
    };
  }
  onItemSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }
  open(content) {
    this.modalService.open(content, { size: 'lg' });
  }
  open1(content1) {
    this.modalService.open(content1, { centered: true });
  }

}
