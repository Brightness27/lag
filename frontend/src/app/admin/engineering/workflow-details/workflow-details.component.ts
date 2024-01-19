import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminServicesService } from 'src/app/services/admin-services/admin-services.service';
import { WorkflowService } from 'src/app/services/workflow-services/workflow.service';

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-workflow-details',
  templateUrl: './workflow-details.component.html',
  styleUrls: ['./workflow-details.component.css']
})
export class WorkflowDetailsComponent implements OnInit {
  isSideNavCollapsed = false;
  screenWidth = 0;

  ctrlno: any;

  admin_id: any;

  updating = false;

  workflow: any;
  files: any[] = [];

  department!: any;

  superadmin = false;
  hr = false;
  accounting = false;
  engineering = false;

  token: any;

  name: string = '';

  return_order: boolean = false;

  isEnergized: boolean = false;

  full_payment: boolean = true;

  alertTitle: string = '';
  alertMessage: string = '';

  delete_id = 0;
  delete_path = '';

  permissions: any = [];

  confirm_admin_id: any = '';
  confirm_admin_password: any = '';
  verificationConfirmed: boolean = false;
  verificationMessage: any = '';

  screen_width!: number;

  editClientDetails = false;
  editPreSurvey = false;
  editDocuments= false;
  editPayment = false;
  editJobOrder = false;
  editLoadSide = false;
  editFinalprocess = false;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screen_width = window.innerWidth;
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private adminService: AdminServicesService,
    private workflowService: WorkflowService,
  ) {
    this.ctrlno = this.activatedRoute.snapshot.params['ctrlno'];
  }

  ngOnInit(): void {
    //get the details of the admin
    this.token = this.adminService.getTokenDetails();

    //set the details of the admin if retrieved
    if (this.token) {
      this.admin_id = this.token.adminId;
      this.adminService.getAdminById(this.admin_id).subscribe((admin) => {
        this.department = admin.department;
        this.name = 'Hello, ' + admin.fname;
        this.setActiveDepartment();
      });
    }
    this.getPermissions();

    this.screen_width = window.innerWidth;
  }

  setActiveDepartment() {
    if (this.department == 'general admin') {
      this.superadmin = true;
    } else if (this.department == 'hr') {
      this.hr = true;
    } else if (this.department == 'accounting') {
      this.accounting = true;
    } else if (this.department == 'engineering') {
      this.engineering = true;
    }
  }

  onToggleSideNav(data: SideNavToggle): void {
    this.screenWidth = data.screenWidth;
    this.isSideNavCollapsed = data.collapsed;
  }

  getBodyClass(): string {
    let styleClass = '';
    if (this.isSideNavCollapsed && this.screenWidth > 768) {
      styleClass = 'body-trimmed';
    } else if (
      this.isSideNavCollapsed &&
      this.screenWidth <= 768 &&
      this.screenWidth > 0
    ) {
      styleClass = 'body-md-screen';
    }

    return styleClass;
  }

  getLabelClass(): string {
    let styleClass = '';
    if(this.screen_width > 670) {
      styleClass = 'fs-5';
    }
    else {
      styleClass = 'fs-6';
    }

    return styleClass;
  }

  getNameClass(): string {
    let styleClass = '';
    if(this.screen_width > 670) {
      styleClass = 'row';
    }
    else {
      styleClass = '';
    }

    return styleClass;
  }

  getColClass(): string {
    let styleClass = '';
    if(this.screen_width > 670) {
      styleClass = 'col';
    }
    else {
      styleClass = 'mb-3';
    }

    return styleClass;
  }

  getWorkflow() {
    this.workflowService.getWorkflowByCtrlno(this.ctrlno).subscribe((workflow) => {
      this.workflow = workflow;
      this.files = this.workflow.files;

      const status = this.workflow.final_processing.tracker_status;

      if (status === 'AWAITING CUSTOMER COMPLIANCE / RETURN ORDER' || status === 'CANCELLED') {
        this.return_order = true;
      } else {
        this.return_order = false;
      }

      if (status === 'ENERGIZED') {
        this.isEnergized = true;
      } else {
        this.isEnergized = false;
      }

      if(status === 'CANCELLED') {
        this.editClientDetails = false;
        this.editPreSurvey = false;
        this.editDocuments= false;
        this.editPayment = false;
        this.editJobOrder = false;
        this.editLoadSide = false;
        this.editFinalprocess = false;

        this.return_order = true;
      }

      else {
        this.editClientDetails = true;
        this.editPreSurvey = true;
        this.editDocuments= true;
        this.editPayment = true;
        this.editJobOrder = true;
        this.editLoadSide = true;
        this.editFinalprocess = true;

        this.return_order = false;
      }

      const payment = this.workflow.payment.payment_mark;

      if (payment === 'Full Payment') {
        this.full_payment = true;
      } else {
        this.full_payment = false;
      }
    });

    
  }

  getSiteLocation(location: string) {
    if(location === 'OFFICE') {
      return 'WALK IN';
    }
    else {
      return location;
    }
  }

  getPermissions() {
    this.adminService
      .getAdminPermissions(this.admin_id)
      .subscribe((permissions) => {
        this.permissions = permissions;

        if(this.permissions.client_details) {
          this.editClientDetails = true;
        }
        else {
          this.editClientDetails = false;
        }

        if(this.permissions.pre_survey) {
          this.editPreSurvey = true;
        }
        else {
          this.editPreSurvey = false;
        }

        if(this.permissions.documents) {
          this.editDocuments = true;
        }
        else {
          this.editDocuments = false;
        }

        if(this.permissions.payment) {
          this.editPayment = true;
        }
        else {
          this.editPayment = false;
        }

        if(this.permissions.job_order) {
          this.editJobOrder = true;
        }
        else {
          this.editJobOrder = false;
        }

        if(this.permissions.load_side) {
          this.editLoadSide = true;
        }
        else {
          this.editLoadSide = false;
        }

        if(this.permissions.final_process) {
          this.editFinalprocess = true;
        }
        else {
          this.editFinalprocess = false;
        }

        this.getWorkflow();
      });
  }

  delete(id: any, delete_path: any) {
    this.delete_id = id;
    this.delete_path = delete_path;
  }

  deleteFile() {
    this.workflowService
      .deleteFile(this.delete_id, this.delete_path)
      .subscribe((msg) => {
        this.alertTitle = 'Delete Successful';
        this.alertMessage = msg.message;

        document.getElementById('alert-open-modal')?.click();

        this.getWorkflow();
      });
  }

  updateLink(step: any) {
    let link = '';

    if(step === 'payment') {
      link = `/admin/engineering/work-flow/update/${this.ctrlno}/accounting/payment`;
    }
    else {
      link = `/admin/engineering/work-flow/update/${this.ctrlno}/${step}`;
    }
    this.router.navigate([link]);
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

        document.getElementById('delete-open-modal')?.click();
      }
    });
    
  }
}
