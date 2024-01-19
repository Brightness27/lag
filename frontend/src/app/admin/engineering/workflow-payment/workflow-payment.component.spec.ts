import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowPaymentComponent } from './workflow-payment.component';

describe('WorkflowPaymentComponent', () => {
  let component: WorkflowPaymentComponent;
  let fixture: ComponentFixture<WorkflowPaymentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WorkflowPaymentComponent]
    });
    fixture = TestBed.createComponent(WorkflowPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
