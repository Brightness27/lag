import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminServicesService } from 'src/app/services/admin-services/admin-services.service';
import { WorkflowService } from 'src/app/services/workflow-services/workflow.service';
import { DatePipe } from '@angular/common';
import { LoadingService } from 'src/app/services/loading-service/loading.service';

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}
@Component({
  selector: 'app-update-workflow',
  templateUrl: './update-workflow.component.html',
  styleUrls: ['./update-workflow.component.css'],
  providers: [DatePipe]
})
export class UpdateWorkflowComponent implements OnInit {
  isSideNavCollapsed = false;
  screenWidth = 0;

  id: any;
  link: string;

  workflow: any;

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
  alertError: boolean = false;

  selectedFilePreSurvey: any = null;
  fileNamesPreSurvey = '';

  selectedFileDocuments: any = null;
  fileNamesDocuments = '';

  selectedFileJobOrder: any = null;
  fileNamesJobOrder = '';

  selectedFileLoadSide: any = null;
  fileNamesLoadSide = '';

  other_structural_classification = '';
  other_selected = false;

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private adminService: AdminServicesService, private workflowService: WorkflowService, private builder: FormBuilder, private datePipe: DatePipe, private loadingService: LoadingService){
    this.id = this.activatedRoute.snapshot.params['id'];
    this.link = '/admin/engineering/work-flow/details/' + this.id;
  }

  work_flow = this.builder.group({
    client_details: this.builder.group({
      id: this.builder.control('', Validators.required),
      name: this.builder.control('', Validators.required),
      address: this.builder.control('', Validators.required),
      contact_no: this.builder.control('', Validators.required),
      date_received: this.builder.control('', Validators.required)
    }),

    pre_survey: this.builder.group({
      id: this.builder.control(''),
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
      id: this.builder.control(''),
      complete_mark: this.builder.control(''),
      remarks: this.builder.control(''),
      documents: ['']
    }),

    payment: this.builder.group({
      id: this.builder.control(''),
      payment_mark: this.builder.control(''),
      ar_or_number: this.builder.control(''),
      remarks: this.builder.control('')
    }),

    job_order: this.builder.group({
      id: this.builder.control(''),
      remarks: this.builder.control(''),
      job_order: ['']
    }),

    load_side: this.builder.group({
      id: this.builder.control(''),
      load_side_mark: this.builder.control(''),
      remarks: this.builder.control(''),
      load_side: ['']
    }),

    final_processing: this.builder.group({
      id: this.builder.control(''),
      coordinator: this.builder.control('')
    })
  });

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

updateWorkflow() {
  this.loadingService.showLoader();
  
  console.log(this.work_flow.value);
  

  const selectedDate = this.work_flow.get('client_details.date_received')?.value;
  const formattedDate = this.datePipe.transform(selectedDate, 'yyyy-MM-dd');

  const workflow_value = {
    clientdetails_id: this.work_flow.get('client_details.id')?.value || null,
    name: this.work_flow.get('client_details.name')?.value || null,
    address: this.work_flow.get('client_details.address')?.value || null,
    contact_no: this.work_flow.get('client_details.contact_no')?.value || null,
    date_received: formattedDate,
    presurvey_id: this.work_flow.get('pre_survey.id')?.value || null,
    facility: this.work_flow.get('pre_survey.facility')?.value || null,
    structural_classification: this.other_structural_classification,
    service_data: this.work_flow.get('pre_survey.service_data')?.value || null,
    private_pole: this.work_flow.get('pre_survey.private_pole')?.value || null,
    number_of_units: this.work_flow.get('pre_survey.number_of_units')?.value || null,
    feasibility: this.work_flow.get('pre_survey.feasibility')?.value || null,
    plus_code: this.work_flow.get('pre_survey.plus_code')?.value || null,
    pre_survey_remarks: this.work_flow.get('pre_survey.remarks')?.value || null,
    pre_survey: this.selectedFilePreSurvey,
    documents_id: this.work_flow.get('documents.id')?.value || null,
    complete_mark: this.work_flow.get('documents.complete_mark')?.value || null,
    documents_remarks: this.work_flow.get('documents.remarks')?.value || null,
    documents: this.selectedFileDocuments,
    payment_id: this.work_flow.get('payment.id')?.value || null,
    payment_mark: this.work_flow.get('payment.payment_mark')?.value || null,
    ar_or_number: this.work_flow.get('payment.ar_or_number')?.value || null,
    payment_remarks: this.work_flow.get('payment.remarks')?.value || null,
    joborder_id: this.work_flow.get('job_order.id')?.value || null,
    job_order_remarks: this.work_flow.get('job_order.remarks')?.value || null,
    job_order: this.selectedFileJobOrder,
    loadside_id: this.work_flow.get('load_side.id')?.value || null,
    load_side_mark: this.work_flow.get('load_side.load_side_mark')?.value || null,
    load_side_remarks: this.work_flow.get('load_side.remarks')?.value || null,
    load_side: this.selectedFileLoadSide,
    finalprocess_id: this.work_flow.get('final_processing.id')?.value || null,
    coordinator: this.work_flow.get('final_processing.coordinator')?.value || null
  };
  
  this.workflowService.updateWorkflow(workflow_value).subscribe(msg =>{
    this.alertTitle = 'Update Work Flow';
    this.alertMessage = msg.message;
    
    this.loadingService.hideLoader();
    document.getElementById('update-open-modal')?.click();

    this.alertError = msg.error;
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

getWorkflow() {
  this.workflowService.getWorkflowById(this.id).subscribe(workflow => {
    this.workflow = workflow;

    const structural_classification = this.workflow.pre_survey.structural_classification;
    let structure_class = '';
    if(structural_classification === 'RES' || structural_classification === 'COM' || structural_classification === 'TEMP' || structural_classification === 'NC' || structural_classification === 'T/S' || structural_classification === 'DOCS PROCESSING ONLY' || structural_classification === 'NET METERING') {
      structure_class = structural_classification;
    }
    else {
      structure_class = 'OTHERS';
      this.other_selected = true;
    }
    

    this.work_flow.patchValue({
      client_details: {
        id: this.workflow.client_details.id,
        name: this.workflow.client_details.client_name,
        address: this.workflow.client_details.client_address,
        contact_no: this.workflow.client_details.client_contact_no,
        date_received: this.workflow.client_details.date_received
      },

      pre_survey: {
        id: this.workflow.pre_survey.id,
        facility: this.workflow.pre_survey.facility,
        structural_classification: structure_class,
        service_data: this.workflow.pre_survey.service_data,
        private_pole: this.workflow.pre_survey.private_pole,
        number_of_units: this.workflow.pre_survey.number_of_units,
        feasibility: this.workflow.pre_survey.feasibility,
        plus_code: this.workflow.pre_survey.plus_code,
        remarks: this.workflow.pre_survey.remarks
      },

      documents: {
        id: this.workflow.documents.id,
        complete_mark: this.workflow.documents.complete_mark,
        remarks: this.workflow.documents.remarks
      },

      payment: {
        id: this.workflow.payment.id,
        payment_mark: this.workflow.payment.payment_mark,
        ar_or_number: this.workflow.payment.ar_or_number,
        remarks: this.workflow.payment.remarks
      },

      job_order: {
        id: this.workflow.job_order.id,
        remarks: this.workflow.job_order.remarks
      },

      load_side: {
        id: this.workflow.load_side.id,
        load_side_mark: this.workflow.load_side.load_side_mark,
        remarks: this.workflow.load_side.remarks
      },

      final_processing: {
        id: this.workflow.final_processing.id,
        coordinator: this.workflow.final_processing.coordinator
      }
    });
    
  });
}
}
