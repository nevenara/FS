import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NgbModule,
    NgSelectModule, FormsModule,
    HttpClientModule,
    NgMultiSelectDropDownModule

  ],
  exports: [
    NgbModule,
    HttpClientModule,
    NgSelectModule, FormsModule,
    NgMultiSelectDropDownModule
  ]
})
export class SharedModule { }
