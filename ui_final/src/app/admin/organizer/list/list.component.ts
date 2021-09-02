import { Component, OnInit } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { SearchOrganizersRequest } from '../../services/models/search-organizers-request';
import { OrganizerService } from '../../services/organizer-service';
import { OrganizerPreview } from '../../models/organizer-preview';
import { saveAs } from "file-saver";
import { RouterModule } from '@angular/router';
import { UserType } from 'src/app/services/models/user-context';
import { AuthenticationService } from 'src/app/services/authentication-service';


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  dropdownList = [];
  selectedItems = [];
  dropdownSettings :IDropdownSettings = {};
  
  searchOrganizersRequest: SearchOrganizersRequest = new SearchOrganizersRequest();
  organizers: Array<OrganizerPreview> = [];

  pages = [];
  totalRecords = 15;

  showLimits = [10, 25, 50];
  organizerId;
  loader = false;

  userType: UserType;

  constructor(
    private organizerService: OrganizerService,
    private authService: AuthenticationService
  ) { }

  ngOnInit(): void {
    this.dropdownList = [
      { item_id: 1, item_text: 'Active' },
      { item_id: 2, item_text: 'Inactive' },
    ];
    this.selectedItems = [{item_id: 1, item_text: 'Active'}];

    this.dropdownSettings = {
      singleSelection: false, 
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 1,
      // allowSearchFilter: true
    };

    this.searchOrganizersRequest.limit = 10;
    this.searchOrganizers();
    this.getUserType();
  }

  getUserType() {
    this.authService.getUserType().subscribe(response => {
      this.userType = response.userType;
    })
  }

  unselectAll() {
    this.selectedItems = [];
    this.searchOrganizers();
  }
  
  onSelectAll(items: any) {
    this.selectedItems = [];
    for (let i = 0; i < this.dropdownList.length; i++) {
      this.selectedItems.push(this.dropdownList[i]);
    }
    this.searchOrganizers();
  }

  next() {
    if (this.searchOrganizersRequest.page < this.pages.length) {
      this.searchOrganizersRequest.page++;
      this.searchOrganizers(true);
    }
  }

  previous() {
    if (this.searchOrganizersRequest.page > 1) {
      this.searchOrganizersRequest.page--;
      this.searchOrganizers(true);
    }
  }

  getFromPage() {
    return (this.searchOrganizersRequest.page - 1) * this.searchOrganizersRequest.limit + 1;
  }

  getToPage() {
    return Math.min(this.searchOrganizersRequest.page * this.searchOrganizersRequest.limit, this.totalRecords);
  }

  onPageChange(page) {
    console.log(page);
    this.searchOrganizersRequest.page = page;
    this.searchOrganizers(true);
  }

  onLimitChange() {
    this.searchOrganizers();
  }

  searchOrganizers(changePage = false) {
    if (!changePage) {
      this.searchOrganizersRequest.page = 1;
    }

    this.loader = true;

    this.searchOrganizersRequest.status = [];
    for (let i = 0; i < this.selectedItems.length; i++) {
      this.searchOrganizersRequest.status.push(this.selectedItems[i].item_text);
    }
    
    this.organizerService.searchOrganizers(this.searchOrganizersRequest).subscribe(response => {
      console.log(response);
      this.organizers = response.organizers;
      this.totalRecords = response.totalRecords;
      this.pages = [];
      for (let i = 0; i < response.totalPages; i++) {
        this.pages.push(i + 1);
      }
      this.loader = false;
    }, error => {
      console.log(error);
      this.loader = false;
    });
  }

  exportExcel() {
    this.organizerService.exportExcel(this.searchOrganizersRequest).subscribe(response => {
      saveAs(response, 'organizers');
    }, error => {
      console.log(error);
    });
  }

  exportCsv() {
    this.organizerService.exportCsv(this.searchOrganizersRequest).subscribe(response => {
      saveAs(response, 'organizers.csv');
    }, error => {
      console.log(error);
    });
  }

  exportPdf() {
    this.organizerService.exportPdf(this.searchOrganizersRequest).subscribe(response => {
      saveAs(response, 'organizers');
    }, error => {
      console.log(error);
    });
  }
}

