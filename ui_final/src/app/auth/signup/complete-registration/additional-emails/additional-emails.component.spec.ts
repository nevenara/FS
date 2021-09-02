import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditionalEmailsComponent } from './additional-emails.component';

describe('AdditionalEmailsComponent', () => {
  let component: AdditionalEmailsComponent;
  let fixture: ComponentFixture<AdditionalEmailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdditionalEmailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdditionalEmailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
