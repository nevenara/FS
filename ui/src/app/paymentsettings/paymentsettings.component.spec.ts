import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentsettingsComponent } from './paymentsettings.component';

describe('PaymentsettingsComponent', () => {
  let component: PaymentsettingsComponent;
  let fixture: ComponentFixture<PaymentsettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentsettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentsettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
