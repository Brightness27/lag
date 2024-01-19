import { Component, HostListener, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminServicesService } from 'src/app/services/admin-services/admin-services.service';
import { LoadingService } from 'src/app/services/loading-service/loading.service';
import { WorkflowService } from 'src/app/services/workflow-services/workflow.service';

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-workflow-payment',
  templateUrl: './workflow-payment.component.html',
  styleUrls: ['./workflow-payment.component.css']
})
export class WorkflowPaymentComponent implements OnInit {

  isSideNavCollapsed = false;
  screenWidth = 0;

  department!: any;

  superadmin = false;
  hr = false;
  accounting = false;
  engineering = false;

  token: any;

  name: string = '';

  screen_width!: number;

  ctrlno: any;
  workflow_id: any;

  package_price: any = 0;

  admin_id: any;

  payment_history: any[] = [];

  permissions: any = [];

  isPermitted: boolean = false;

  updateForm!: FormGroup;

  link: string;

  alertTitle: string = '';
  alertMessage: string = '';

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screen_width = window.innerWidth;
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private adminService: AdminServicesService,
    private workflowService: WorkflowService,
    private loadingService: LoadingService
  ) {
    this.ctrlno = this.activatedRoute.snapshot.params['ctrlno'];
    this.link = '/admin/engineering/work-flow/details/' + this.ctrlno;
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
    this.updateForm = this.createFormGroup();

    this.getPermissions();
    
    this.getPackagePrice();

    this.screen_width = window.innerWidth;
  }

  createFormGroup() {
    return new FormGroup({
      package_price: new FormControl(0),
      amount: new FormControl(0),
      ar_or_number: new FormControl(''),
      date_of_payment: new FormControl(''),
      remarks: new FormControl('')
    });
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

  getPermissions() {
    this.adminService
      .getAdminPermissions(this.admin_id)
      .subscribe((permissions) => {
        this.permissions = permissions;

        if(this.permissions.payment) {
          this.isPermitted = true;
        }
        else {
          this.isPermitted = false;
        }
      });
  }

  getPackagePrice() {
    this.workflowService.getWorkflowByCtrlno(this.ctrlno).subscribe(workflow => {
      this.package_price = workflow.payment.package_price;
      this.workflow_id = workflow.client_details.id;

      if(this.package_price !== 0) {
        this.updateForm.patchValue({
          package_price: this.package_price
        });

        this.updateForm.get('package_price')?.disable();
      }

      this.getPaymentHistory();
    });

    
  }

  getPaymentHistory() {
    
    let num = 1;
    this.workflowService.getPaymentHistory(this.workflow_id).subscribe(history => {
      this.payment_history = history.map(history => {
        return {
          ... history,
          num: num++
        };
      });
    });
  }

  submitPayment() {
    this.loadingService.showLoader();
    
    this.workflowService.updatePayment(this.updateForm.value, this.workflow_id).subscribe(msg => {
      this.alertTitle = 'Update Work Flow';
      this.alertMessage = msg.message;
      
      this.loadingService.hideLoader();
      document.getElementById('update-open-modal')?.click();
  
      this.getPackagePrice();
    });
  }

}
