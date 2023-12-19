import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminServicesService } from 'src/app/services/admin-services/admin-services.service';
import { WorkflowService } from 'src/app/services/workflow-services/workflow.service';
import { DatePipe } from '@angular/common';

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-workflow-details',
  templateUrl: './workflow-details.component.html',
  styleUrls: ['./workflow-details.component.css'],
  providers: [DatePipe]
})
export class WorkflowDetailsComponent implements OnInit {

  isSideNavCollapsed = false;
  screenWidth = 0;

  id: any;
  link: string;

  updating = false;

  workflow: any;
  files: any[] = [];

  department!: any;

  superadmin = false;
  hr = false;
  accounting = false;
  engineering = false;

  token: any;

  name: string=  '';

  isLinear = true;

  alertTitle: string = '';
  alertMessage: string = '';

  delete_id = 0;
  delete_path = '';

  constructor(private activatedRoute: ActivatedRoute, private adminService: AdminServicesService, private workflowService: WorkflowService, private builder: FormBuilder, private datePipe: DatePipe){
    this.id = this.activatedRoute.snapshot.params['id'];
    this.link = '/admin/engineering/work-flow/update/' + this.id;
  }

  ngOnInit(): void {
    //get the details of the admin
    this.token = this.adminService.getTokenDetails();

    //set the details of the admin if retrieved
    if(this.token) {
      const id = this.token.adminId;
      this.adminService.getAdminById(id).subscribe(admin => {
        this.department = admin.department;
        this.name = 'Hello, ' + admin.fname;
        this.setActiveDepartment();
      });
    }

   this.getWorkflow();
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

getWorkflow() {
  this.workflowService.getWorkflowById(this.id).subscribe(workflow => {
    this.workflow = workflow;
    this.files = this.workflow.files;
    
  });
}

delete(id: any, delete_path: any) {
  this.delete_id = id;
  this.delete_path = delete_path;
}

deleteFile() {
  this.workflowService.deleteFile(this.delete_id, this.delete_path).subscribe(msg => {
    this.alertTitle = 'Delete Successful'
    this.alertMessage = msg.message;

    document.getElementById('alert-open-modal')?.click();

    this.getWorkflow();
  });
}

}
