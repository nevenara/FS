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
  dropdownList2 = [];
  selectedItems2 = [];
  dropdownSettings2 :IDropdownSettings = {};
  dropdownList3 = [];
  selectedItems3 = [];
  dropdownSettings3 :IDropdownSettings = {};
  model;


  day = [
    {id: 1, name: '1'}, {id: 2, name: '2'}, {id: 3, name: '3'}, {id: 4, name: '4'}, {id: 5, name: '5'},
   {id: 27, name: '27'}, {id: 28, name: '28'}, {id: 29, name: '29'}, {id: 30, name: '30'},
    {id: 31, name: '31'},
  ];

  constructor() { }

  ngOnInit(): void {
    this.dropdownList = [
      { item_id: 1, item_text: 'Verifed' },
      { item_id: 2, item_text: 'Registered' },
      { item_id: 3, item_text: 'Inactive' },

    ];
    this.selectedItems = [
      { item_id: 3, item_text: 'Verifed' },
      { item_id: 2, item_text: 'Inactive' }
    ];
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 10,
      allowSearchFilter: true
    };
    this.dropdownList2 = [
      { item_id: 1, item_text: 'Main account' },
      { item_id: 2, item_text: 'Linked Accoun' },
  
    ];
    this.selectedItems2 = [
      { item_id: 2, item_text: 'Linked Accoun' },
    ];
    this.dropdownSettings2 = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 10,
      allowSearchFilter: true
    };
  
  this.dropdownList3 = [
    { item_id: 1, item_text: 'User requested' },
    { item_id: 2, item_text: 'User verifcation invalid ' },
    { item_id: 3, item_text: 'Misuse linked accounts' },
    { item_id: 4, item_text: 'Suspected ticket trading' },
    
  
  ];
  this.selectedItems3 = [
    { item_id: 4, item_text: 'Suspected ticket trading' },
  ];
  this.dropdownSettings3 = {
    singleSelection: false,
    idField: 'item_id',
    textField: 'item_text',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 10,
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

  


