import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbNav } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit, AfterViewInit {

  @ViewChild(NgbNav) ngbTabset: NgbNav;

  loaderGeneral = true;
  
  constructor(
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private translate: TranslateService
  ) { }

  ngOnInit() {

  }

  ngAfterViewInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params.type && +params.type >= 1 && +params.type <= 2) {
        this.ngbTabset.select(+params.type);
      } 
      this.loaderGeneral = false;
      this.cdr.detectChanges();
    });
  }

}
