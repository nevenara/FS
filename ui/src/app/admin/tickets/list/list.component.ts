import { Component, OnInit } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  dropdownList = [];
  selectedItems = [];
  dropdownSettings :IDropdownSettings = {};
  model;


  day = [
    {id: 1, name: '1'}, {id: 2, name: '2'}, {id: 3, name: '3'}, {id: 4, name: '4'}, {id: 5, name: '5'},
   {id: 27, name: '27'}, {id: 28, name: '28'}, {id: 29, name: '29'}, {id: 30, name: '30'},
    {id: 31, name: '31'},
  ];

  constructor() { }

  ngOnInit(): void {
    this.dropdownList = [
      { item_id: 1, item_text: 'Personalized' },
      { item_id: 2, item_text: 'Personalization pending' },
      { item_id: 3, item_text: 'Personalization failed' },
      { item_id: 4, item_text: 'Checked-in' },

    ];
    this.selectedItems = [
      { item_id: 3, item_text: 'Personalized' },
      { item_id: 4, item_text: 'Personalization failed' }
    ];
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 1,
      allowSearchFilter: true
    };
  }
  onItemSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }

    
  }
  

