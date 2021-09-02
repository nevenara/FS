import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkedDtailComponent } from './linked-dtail.component';

describe('LinkedDtailComponent', () => {
  let component: LinkedDtailComponent;
  let fixture: ComponentFixture<LinkedDtailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinkedDtailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkedDtailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
