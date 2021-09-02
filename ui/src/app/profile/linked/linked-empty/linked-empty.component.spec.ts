import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkedEmptyComponent } from './linked-empty.component';

describe('LinkedEmptyComponent', () => {
  let component: LinkedEmptyComponent;
  let fixture: ComponentFixture<LinkedEmptyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinkedEmptyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkedEmptyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
