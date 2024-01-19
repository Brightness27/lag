import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AdminServicesService } from 'src/app/services/admin-services/admin-services.service';
import { WorkflowService } from 'src/app/services/workflow-services/workflow.service';

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-status-updates',
  templateUrl: './status-updates.component.html',
  styleUrls: ['./status-updates.component.css']
})
export class StatusUpdatesComponent implements OnInit {

  isSideNavCollapsed = false;
  screenWidth = 0;

  ctrlno: any;

  department!: any;

  name: string =  '';

  superadmin = false;
  hr = false;
  accounting = false;
  engineering = false;

  token: any;

  updateStatusForm!: FormGroup;
  editupdateStatusForm!: FormGroup;

  update_status = '';
  client_name = '';

  workflow: any = {};

  alertTitle = '';
  alertMessage = '';

  confirm_admin_id: any = '';
  confirm_admin_password: any = '';
  verificationConfirmed: boolean = false;
  verificationMessage: any = '';

  constructor(private activeRoute: ActivatedRoute, private adminService: AdminServicesService, private workflowService: WorkflowService) {
    this.ctrlno = this.activeRoute.snapshot.params['ctrlno'];
  }

  ngOnInit(): void {
    this.token = this.adminService.getTokenDetails();

    if(this.token) {
      const id = this.token.adminId;
      this.adminService.getAdminById(id).subscribe(admin => {
        this.department = admin.department;
        this.name = 'Hello, ' + admin.fname;
        this.setActiveDepartment();
      });
    }

    this.updateStatusForm = this.createForm();
    this.editupdateStatusForm = this.createForm();

    this.getWorkflowByCtrlno();
  }

  getStatus(trackerStatus: string | null): string {
    let status = '';

    if(!trackerStatus) {
      status = 'ON PROCESS';
    }
    else {
      status = trackerStatus!;
    }
    return status;
  }

  getWorkflowByCtrlno() {
    this.workflowService.getWorkflowByCtrlno(this.ctrlno).subscribe((workflow) => {
      
      this.updateWorkflowId(workflow.client_details.id);

      this.update_status = this.getStatus(workflow.final_processing.tracker_status);
      
    });
  }

  updateWorkflowId(id: any) {
    this.workflowService.getWorkflowStatus(id).subscribe(workflow => {
      this.workflow = workflow;
      this.client_name = `${workflow.client_fname} ${workflow.client_mname} ${workflow.client_lname}`;
    });
  }

  createForm(): FormGroup {
    return new FormGroup({
      id: new FormControl(''),
      action_date: new FormControl(''),
      actions_taken: new FormControl(''),
      customers_feedback: new FormControl(''),
      action_taken_by	: new FormControl('')
    });
  }
  
  setActiveDepartment() {
    if(this.department == 'general admin') {
      this.superadmin = true;
      
    }
    else if(this.department == 'hr') {
      this.hr = true;
    }
    else if(this.department == 'accounting') {
      this.accounting = true;
    }
    else if(this.department == 'engineering') {
      this.engineering = true;
    }
    
  }

  onToggleSideNav(data: SideNavToggle): void {
    this.screenWidth = data.screenWidth;
    this.isSideNavCollapsed = data.collapsed;
  }

  getBodyClass(): string {
    let styleClass = '';
    if(this.isSideNavCollapsed && this.screenWidth > 768) {
      styleClass = 'body-trimmed';
    }
    else if(this.isSideNavCollapsed && this.screenWidth <= 768 && this.screenWidth > 0) {
      styleClass = 'body-md-screen';
    }

    return styleClass;
  }

  addUpdate() {
    const workflow_id = this.workflow.id;
    this.workflowService.addWorkflowstatus(workflow_id, this.updateStatusForm.value).subscribe((msg) => {
      this.alertTitle = 'Status Update';
      this.alertMessage = msg.message;

      this.updateStatusForm.reset;
      this.workflow = {};

      this.workflowService.getWorkflowStatus(workflow_id).subscribe(workflow => {
        this.workflow = workflow;
  
      });

      document.getElementById('open-modal')?.click();
    });
  }

  editUpdate() {
    console.log(this.editupdateStatusForm.value);
    
    const workflow_id = this.workflow.id;
    this.workflowService.updateWorkflowstatus(this.editupdateStatusForm.value).subscribe((msg) => {
      this.alertTitle = 'Status Update';
      this.alertMessage = msg.message;

      this.editupdateStatusForm.reset;
      this.workflow = {};

      this.workflowService.getWorkflowStatus(workflow_id).subscribe(workflow => {
        this.workflow = workflow;
  
      });

      document.getElementById('open-modal')?.click();
    });
  }

  editingUpdate(status: any) {
    this.editupdateStatusForm.patchValue({
      id: status.id,
      action_date: status.action_date,
      actions_taken: status.actions_taken,
      customers_feedback: status.customers_feedback,
      action_taken_by	: status.action_taken_by
    });
  }

  updateAdminId(event: any) {
    this.confirm_admin_id = event.target.value;
  }

  updateAdminPassword(event: any) {
    this.confirm_admin_password = event.target.value;
  }

  verifyConfirmation() {
    const credentials = {
      id: this.confirm_admin_id,
      password: this.confirm_admin_password
    }
    
    this.adminService.verifyAdmin(credentials).subscribe(verification => {
      this.verificationConfirmed = verification.verified;
      this.verificationMessage = verification.message;

      if(this.verificationConfirmed) {
        this.verificationConfirmed = false;
        this.verificationMessage = '';

        this.confirm_admin_id = '';
        this.confirm_admin_password = '';

        document.getElementById('edit-open-modal')?.click();
      }
    });
    
  }
}
