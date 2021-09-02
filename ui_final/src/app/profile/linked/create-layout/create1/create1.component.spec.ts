import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Create1Component } from './create1.component';

describe('Create1Component', () => {
  let component: Create1Component;
  let fixture: ComponentFixture<Create1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Create1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Create1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
