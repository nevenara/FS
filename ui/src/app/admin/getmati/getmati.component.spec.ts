import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GetmatiComponent } from './getmati.component';

describe('GetmatiComponent', () => {
  let component: GetmatiComponent;
  let fixture: ComponentFixture<GetmatiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GetmatiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GetmatiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
