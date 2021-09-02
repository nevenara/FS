import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketTicketsComponent } from './market-tickets.component';

describe('MarketTicketsComponent', () => {
  let component: MarketTicketsComponent;
  let fixture: ComponentFixture<MarketTicketsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketTicketsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketTicketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
