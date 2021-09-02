import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QCRMComponent } from './qcrm.component';

describe('QCRMComponent', () => {
  let component: QCRMComponent;
  let fixture: ComponentFixture<QCRMComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QCRMComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QCRMComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
