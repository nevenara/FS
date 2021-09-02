import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainAccountComponent } from './main-account.component';

describe('MainAccountComponent', () => {
  let component: MainAccountComponent;
  let fixture: ComponentFixture<MainAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
