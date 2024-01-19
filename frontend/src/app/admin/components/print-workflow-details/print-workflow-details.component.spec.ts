import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintWorkflowDetailsComponent } from './print-workflow-details.component';

describe('PrintWorkflowDetailsComponent', () => {
  let component: PrintWorkflowDetailsComponent;
  let fixture: ComponentFixture<PrintWorkflowDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PrintWorkflowDetailsComponent]
    });
    fixture = TestBed.createComponent(PrintWorkflowDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
