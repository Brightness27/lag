import { Component, OnInit, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminServicesService } from 'src/app/services/admin-services/admin-services.service';
import { WorkflowService } from 'src/app/services/workflow-services/workflow.service';
import { MatStepper } from '@angular/material/stepper';
import { DatePipe } from '@angular/common';
import { LoadingService } from 'src/app/services/loading-service/loading.service';
import { Router } from '@angular/router';

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-add-workflow',
  templateUrl: './add-workflow.component.html',
  styleUrls: ['./add-workflow.component.css'],
  providers: [DatePipe]
})
export class AddWorkflowComponent implements OnInit {
  @ViewChildren('stepper') stepper!: MatStepper;

  isSideNavCollapsed = false;
  screenWidth = 0;

  department!: any;
  superadmin = false;
  hr = false;
  accounting = false;
  engineering = false;

  token: any;
  id: any;
  name: string = '';

  isLinear = true;

  alertTitle: string = '';
  alertMessage: string = '';
  alertError: boolean = false;

  link = '';

  selectedFilePreSurvey: any = null;
  fileNamesPreSurvey = '';

  selectedFileDocuments: any = null;
  fileNamesDocuments = '';

  selectedFileJobOrder: any = null;
  fileNamesJobOrder = '';

  selectedFileLoadSide: any = null;
  fileNamesLoadSide = '';

  constructor(private router: Router, private adminService: AdminServicesService, private builder: FormBuilder, private workflowService: WorkflowService, private datePipe: DatePipe, private loadingService: LoadingService) {}
  
  work_flow = this.builder.group({
    client_details: this.builder.group({
      name: this.builder.control('', Validators.required),
      address: this.builder.control('', Validators.required),
      contact_no: this.builder.control('', Validators.required),
      date_received: this.builder.control('', Validators.required)
    }),

    pre_survey: this.builder.group({
      facility: this.builder.control(''),
      structural_classification: this.builder.control(''),
      service_data: this.builder.control(''),
      private_pole: this.builder.control(''),
      number_of_units: this.builder.control(''),
      feasibility: this.builder.control(''),
      plus_code: this.builder.control(''),
      remarks: this.builder.control(''),
      pre_survey: ['']
    }),

    documents: this.builder.group({
      complete_mark: this.builder.control(''),
      remarks: this.builder.control(''),
      documents: ['']
    }),

    payment: this.builder.group({
      payment_mark: this.builder.control(''),
      ar_or_number: this.builder.control(''),
      remarks: this.builder.control('')
    }),

    job_order: this.builder.group({
      remarks: this.builder.control(''),
      job_order: ['']
    }),

    load_side: this.builder.group({
      load_side_mark: this.builder.control(''),
      remarks: this.builder.control(''),
      load_side: ['']
    }),

    final_processing: this.builder.group({
      coordinator: this.builder.control('')
    })
  });

  other_structural_classification = '';
  other_selected = false;

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

  onFileSelectedPreSurvey(event: any): void {
    const fileInput = event.target;

    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedFilePreSurvey = fileInput.files;

      const length = this.selectedFilePreSurvey.length;
      this.fileNamesPreSurvey = '';

      this.selectedFilePreSurvey.forEach((currentValue: any, index: any) => {
        if((index + 1) < length) {
          this.fileNamesPreSurvey = this.fileNamesPreSurvey + currentValue.name + "\n";
        }
        else{
          this.fileNamesPreSurvey = this.fileNamesPreSurvey + currentValue.name;
        }
      });
    }
  }

  onFileSelectedDocuments(event: any): void {
    const fileInput = event.target;

    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedFileDocuments = fileInput.files;

      const length = this.selectedFileDocuments.length;
      this.fileNamesDocuments = '';

      this.selectedFileDocuments.forEach((currentValue: any, index: any) => {
        if((index + 1) < length) {
          this.fileNamesDocuments = this.fileNamesDocuments + currentValue.name + "\n";
        }
        else{
          this.fileNamesDocuments = this.fileNamesDocuments + currentValue.name;
        }
      });
    }
  }
  
  onFileSelectedJobOrder(event: any): void {
    const fileInput = event.target;

    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedFileJobOrder = fileInput.files;

      const length = this.selectedFileJobOrder.length;
      this.fileNamesJobOrder = '';

      this.selectedFileJobOrder.forEach((currentValue: any, index: any) => {
        if((index + 1) < length) {
          this.fileNamesJobOrder = this.fileNamesJobOrder + currentValue.name + "\n";
        }
        else{
          this.fileNamesJobOrder = this.fileNamesJobOrder + currentValue.name;
        }
      });
    }
  }

  onFileSelectedLoadSide(event: any): void {
    const fileInput = event.target;

    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedFileLoadSide = fileInput.files;

      const length = this.selectedFileLoadSide.length;
      this.fileNamesLoadSide = '';

      this.selectedFileLoadSide.forEach((currentValue: any, index: any) => {
        if((index + 1) < length) {
          this.fileNamesLoadSide = this.fileNamesLoadSide + currentValue.name + "\n";
        }
        else{
          this.fileNamesLoadSide = this.fileNamesLoadSide + currentValue.name;
        }
      });
    }
  }

  updateStructuralClassification(event: any) {
    this.other_structural_classification = event.target.value;
  }

  select_other() {
    const structural_class = this.work_flow.get('pre_survey.structural_classification')?.value;
    
    if(structural_class === 'OTHERS') {
      this.other_selected = true;
      this.other_structural_classification = '';
    }
    else {
      this.other_selected = false;
      this.other_structural_classification = structural_class ?? '';
    }

    
  }

  submitForm() {

    this.loadingService.showLoader();

    const selectedDate = this.work_flow.get('client_details.date_received')?.value;
    const formattedDate = this.datePipe.transform(selectedDate, 'yyyy-MM-dd');

    const workflow_value = {
        name: this.work_flow.get('client_details.name')?.value || null,
        address: this.work_flow.get('client_details.address')?.value || null,
        contact_no: this.work_flow.get('client_details.contact_no')?.value || null,
        date_received: formattedDate,
        facility: this.work_flow.get('pre_survey.facility')?.value || null,
        structural_classification: this.other_structural_classification,
        service_data: this.work_flow.get('pre_survey.service_data')?.value || null,
        private_pole: this.work_flow.get('pre_survey.private_pole')?.value || null,
        number_of_units: this.work_flow.get('pre_survey.number_of_units')?.value || null,
        feasibility: this.work_flow.get('pre_survey.feasibility')?.value || null,
        plus_code: this.work_flow.get('pre_survey.plus_code')?.value || null,
        pre_survey_remarks: this.work_flow.get('pre_survey.remarks')?.value || null,
        pre_survey: this.selectedFilePreSurvey,
        complete_mark: this.work_flow.get('documents.complete_mark')?.value || null,
        documents_remarks: this.work_flow.get('documents.remarks')?.value || null,
        documents: this.selectedFileDocuments,
        payment_mark: this.work_flow.get('payment.payment_mark')?.value || null,
        ar_or_number: this.work_flow.get('payment.ar_or_number')?.value || null,
        payment_remarks: this.work_flow.get('payment.remarks')?.value || null,
        job_order_remarks: this.work_flow.get('job_order.remarks')?.value || null,
        job_order: this.selectedFileJobOrder,
        load_side_mark: this.work_flow.get('load_side.load_side_mark')?.value || null,
        load_side_remarks: this.work_flow.get('load_side.remarks')?.value || null,
        load_side: this.selectedFileLoadSide,
        coordinator: this.work_flow.get('final_processing.coordinator')?.value || null
    };

    
    this.workflowService.addWorkflow(workflow_value).subscribe(msg => {
      this.alertTitle = 'Add Work Flow';
      this.alertMessage = msg.message;
      this.alertError = msg.error;
      this.link = '/admin/engineering/work-flow/details/' + msg.id;

      document.getElementById('open-modal')?.click();

      this.loadingService.hideLoader();
    });
  }

  dismissModal() {
    if(!this.alertError) {
      this.router.navigate([this.link]);
    }
  }

  get clientDetails() {
    return this.work_flow.get('client_details') as FormGroup;
  }
}
