import { Component, HostListener, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { faPlus, faSearch } from '@fortawesome/free-solid-svg-icons';
import { AdminServicesService } from 'src/app/services/admin-services/admin-services.service';
import { WorkflowService } from 'src/app/services/workflow-services/workflow.service';

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-workflow-list',
  templateUrl: './workflow-list.component.html',
  styleUrls: ['./workflow-list.component.css']
})
export class WorkflowListComponent implements OnInit {

  isSideNavCollapsed = false;
  screenWidth = 0;

  workflows: any[] = [];

  department!: any;
  superadmin = false;
  hr = false;
  accounting = false;
  engineering = false;

  addWorkflow = faPlus;
  hideAddText = true;

  search = faSearch;
  searchKey: string = "";

  token: any;
  id: any;
  name: string = '';

  workflow: any = {};
  noWorkflowStatus = true;

  updateStatusForm!: FormGroup;

  alertTitle = '';
  alertMessage = '';

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if(window.innerWidth > 768) {
      this.hideAddText = true;
    }
    else if(window.innerWidth <= 768 && window.innerWidth > 0) {
      this.hideAddText = false;
    }
  }

  constructor(private adminService: AdminServicesService, private workflowService: WorkflowService) {}

  ngOnInit(): void {
    //get the details of the admin
    this.token = this.adminService.getTokenDetails();

    //set the details of the admin if retrieved
    if(this.token) {
      this.id = this.token.adminId;
      this.adminService.getAdminById(this.id).subscribe(admin => {
        this.department = admin.department;
        this.setActiveDepartment();
        this.name = 'Hello, ' + admin.fname;
      });
    }

    if(window.innerWidth > 768) {
      this.hideAddText = true;
    }
    else if(window.innerWidth <= 768 && window.innerWidth > 0) {
      this.hideAddText = false;
    }

    this.getAllWorkflows();

    this.updateStatusForm = this.createForm();
  }

  createForm(): FormGroup {
    return new FormGroup({
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

  //send the screen width and collapsed state to the side nav
  onToggleSideNav(data: SideNavToggle): void {
    this.screenWidth = data.screenWidth;
    this.isSideNavCollapsed = data.collapsed;
  }

  //set the class of the main container section in relation to the side nav
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

  updateSearchKey(event: any) {
    this.searchKey = event.target.value;
  }

  searchItem() {
    if(this.searchKey === "") {
      this.getAllWorkflows();
    }
    else {
      var counter = 1;
      this.workflowService.searchWorkflows(this.searchKey).subscribe(workflows => {
      
        this.workflows = workflows.map(workflow => {
          return {
            ...workflow,
            link: '/admin/engineering/work-flow/details/' + workflow.id,
            num: counter++,
          };
        });
      });
    }
  }

  getAllWorkflows() {
    var counter = 1;
    this.workflowService.getAllWorkflows().subscribe(workflows => {
      this.workflows = workflows.map(workflow => {
        return {
          ...workflow,
          link: '/admin/engineering/work-flow/details/' + workflow.id,
          num: counter++,
        };
      });
    });
  }

  updateWorkflowId(id: any) {
    this.workflowService.getWorkflowStatus(id).subscribe(workflow => {
      this.workflow = workflow;

      if(!this.workflow.status_updates || this.workflow.status_updates.length === 0){
        this.noWorkflowStatus = true;
      }
      else {
        this.noWorkflowStatus = false;
      }

    });
  }

  addUpdate() {
    console.log(this.updateStatusForm.value);
    
    const workflow_id = this.workflow.id;
    this.workflowService.addWorkflowstatus(workflow_id, this.updateStatusForm.value).subscribe((msg) => {
      this.alertTitle = 'Leave Record';
      this.alertMessage = msg.message;

      this.updateStatusForm.reset;
      this.workflow = {};

      this.workflowService.getWorkflowStatus(workflow_id).subscribe(workflow => {
        this.workflow = workflow;
  
        if(!this.workflow.status_updates || this.workflow.status_updates.length === 0){
          this.noWorkflowStatus = true;
        }
        else {
          this.noWorkflowStatus = false;
        }
  
      });

      document.getElementById('open-modal')?.click();
    });
  }
}
