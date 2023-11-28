import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlowOfWorkComponent } from './flow-of-work.component';

describe('FlowOfWorkComponent', () => {
  let component: FlowOfWorkComponent;
  let fixture: ComponentFixture<FlowOfWorkComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FlowOfWorkComponent]
    });
    fixture = TestBed.createComponent(FlowOfWorkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
