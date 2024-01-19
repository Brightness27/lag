import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AdminServicesService } from 'src/app/services/admin-services/admin-services.service';
import { WorkflowService } from 'src/app/services/workflow-services/workflow.service';
import { LoadingService } from 'src/app/services/loading-service/loading.service';

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}
@Component({
  selector: 'app-update-workflow',
  templateUrl: './update-workflow.component.html',
  styleUrls: ['./update-workflow.component.css']
})
export class UpdateWorkflowComponent implements OnInit {
  isSideNavCollapsed = false;
  screenWidth = 0;

  admin_id: any;
  ctrlno: any;
  step: any;
  link: string;

  workflow: any;
  workflow_id: any;

  department!: any;

  superadmin = false;
  hr = false;
  accounting = false;
  engineering = false;

  token: any;

  name: string = '';

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

  other_service_data = '';
  other_service_data_selected = false;

  other_load_side = '';
  other_load_side_selected = false;

  return_order = false;
  isEnergized = false;

  full_payment: boolean = true;

  clientDetailsForm!: FormGroup;
  preSurveyForm!: FormGroup;
  documentsForm!: FormGroup;
  paymentForm!: FormGroup;
  jobOrderForm!: FormGroup;
  loadSideForm!: FormGroup;
  finalProcessForm!: FormGroup;

  title: string = '';

  permissions: any[] = [];

  permissionGranted: boolean = false;

  structural_classifications: any[] = [];
  service_data: any[] = [];
  load_side: any[] = [];

  screen_width!: number;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screen_width = window.innerWidth;
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private adminService: AdminServicesService,
    private workflowService: WorkflowService,
    private loadingService: LoadingService
  ) {
    this.ctrlno = this.activatedRoute.snapshot.params['ctrlno'];
    this.step = this.activatedRoute.snapshot.params['step'];
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

      this.title = this.transform(this.step.toString().replace('_', ' '));

      this.getStructuralClassificationsOptions();
      this.getServiceDataOptions();
      this.getLoadSideOptions();
    }

    this.getPermissions();

    this.clientDetailsForm = this.createClientDetailsFormGroup();
    this.preSurveyForm = this.createPreSurveyFormGroup();
    this.documentsForm = this.createDocumentsFormGroup();
    this.paymentForm = this.createPaymentFormGroup();
    this.jobOrderForm = this.createJobOrderFormGroup();
    this.loadSideForm = this.createLoadSideFormGroup();
    this.finalProcessForm = this.createFinalProcessFormGroup();

    this.getWorkflow();

    this.screen_width = window.innerWidth;
  }

  getStructuralClassificationsOptions() {
    this.workflowService.getOptions('pre_survey', 'structural_classification').subscribe((structural_classifications) => {
      this.structural_classifications = structural_classifications;
    });
  }

  getServiceDataOptions() {
    this.workflowService.getOptions('pre_survey', 'service_data').subscribe((service_data) => {
      this.service_data = service_data;
    });
  }

  getLoadSideOptions() {
    this.workflowService.getOptions('load_side', 'load_side').subscribe((load_side) => {
      this.load_side = load_side;
    });
  }

  getPermissions() {
    this.adminService.getAdminPermissions(this.admin_id).subscribe(permissions => {

      switch (this.step) {
        case 'client_details' :
            this.permissionGranted = permissions.client_details;
            break;

        case 'pre_survey' :
            this.permissionGranted = permissions.pre_survey;
            break;

        case 'documents' :
            this.permissionGranted = permissions.documents;
            break;

        case 'payment' :
            this.permissionGranted = permissions.payment;
            break;

        case 'job_order' :
            this.permissionGranted = permissions.job_order;
            break;

        case 'load_side' :
            this.permissionGranted = permissions.load_side;
            break;

        case 'final_process' :
            this.permissionGranted = permissions.final_process;
            break;
      }
    });
  }

  transform(value: string): string {
    const inputText = value.toLowerCase().split(' ');
    for (let i = 0; i < inputText.length; i++) {
      inputText[i] =
        inputText[i].charAt(0).toUpperCase() + inputText[i].slice(1);
    }
    return inputText.join(' ');
  }

  createClientDetailsFormGroup(): FormGroup {
    return new FormGroup({
      fname: new FormControl(''),
      mname: new FormControl(''),
      lname: new FormControl(''),
      address: new FormControl(''),
      contact_no: new FormControl(''),
      date_received: new FormControl(''),
      initial_communicator: new FormControl(''),
    });
  }

  createPreSurveyFormGroup(): FormGroup {
    return new FormGroup({
      id: new FormControl(''),
      facility: new FormControl(''),
      structural_classification: new FormControl(''),
      service_data: new FormControl(''),
      private_pole: new FormControl(''),
      number_of_units: new FormControl(''),
      feasibility: new FormControl(''),
      plus_code: new FormControl(''),
      remarks: new FormControl(''),
      pre_survey: new FormControl(''),
    });
  }

  createDocumentsFormGroup(): FormGroup {
    return new FormGroup({
      id: new FormControl(''),
      complete_mark: new FormControl(''),
      remarks: new FormControl(''),
      documents: new FormControl(''),
    });
  }

  createPaymentFormGroup(): FormGroup {
    return new FormGroup({
      id: new FormControl(''),
      package_price: new FormControl(''),
      payment_mark: new FormControl(''),
      amount: new FormControl(0),
      down_payment: new FormControl(0.),
      balance: new FormControl(0),
      ar_or_number: new FormControl(''),
      remarks: new FormControl(''),
      
    });
  }

  createJobOrderFormGroup(): FormGroup {
    return new FormGroup({
      id: new FormControl(''),
      remarks: new FormControl(''),
      job_order: new FormControl(''),
    });
  }

  createLoadSideFormGroup(): FormGroup {
    return new FormGroup({
      id: new FormControl(''),
      load_side_mark: new FormControl(''),
      remarks: new FormControl(''),
      load_side: new FormControl(''),
    });
  }

  createFinalProcessFormGroup(): FormGroup {
    return new FormGroup({
      id: new FormControl(''),
      coordinator: new FormControl(''),
      cbm_no: new FormControl(''),
      case_no: new FormControl(''),
      sin_no: new FormControl(''),
      tracker_status: new FormControl(''),
      date_energized: new FormControl(''),
      reason: new FormControl('')
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


  onFileSelectedPreSurvey(event: any): void {
    const fileInput = event.target;

    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedFilePreSurvey = fileInput.files;

      const length = this.selectedFilePreSurvey.length;
      this.fileNamesPreSurvey = '';

      this.selectedFilePreSurvey.forEach((currentValue: any, index: any) => {
        if (index + 1 < length) {
          this.fileNamesPreSurvey =
            this.fileNamesPreSurvey + currentValue.name + '\n';
        } else {
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
        if (index + 1 < length) {
          this.fileNamesDocuments =
            this.fileNamesDocuments + currentValue.name + '\n';
        } else {
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
        if (index + 1 < length) {
          this.fileNamesJobOrder =
            this.fileNamesJobOrder + currentValue.name + '\n';
        } else {
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
        if (index + 1 < length) {
          this.fileNamesLoadSide =
            this.fileNamesLoadSide + currentValue.name + '\n';
        } else {
          this.fileNamesLoadSide = this.fileNamesLoadSide + currentValue.name;
        }
      });
    }
  }

  updateStructuralClassification(event: any) {
    this.other_structural_classification = event.target.value;
  }

  updateServiceData(event: any) {
    this.other_service_data = event.target.value;
  }

  updateLoadSide(event: any) {
    this.other_load_side = event.target.value;
  }

  select_other() {
    const structural_class = this.preSurveyForm.get('structural_classification')?.value;

    if (structural_class === 'OTHERS') {
      this.other_selected = true;
      this.other_structural_classification = '';
    } else {
      this.other_selected = false;
      this.other_structural_classification = structural_class ?? '';
    }
    
  }

  select_other_service_data() {
    const service_data = this.preSurveyForm.get('service_data')?.value;

    if (service_data === 'OTHERS') {
      this.other_service_data_selected = true;
      this.other_service_data = '';
    } else {
      this.other_service_data_selected = false;
      this.other_service_data = service_data ?? '';
    }
  }

  select_other_load_side() {
    const loadSide = this.loadSideForm.get('load_side_mark')?.value;

    if (loadSide === 'OTHERS') {
      this.other_load_side_selected = true;
      this.other_load_side = '';
    } else {
      this.other_load_side_selected = false;
      this.other_load_side = loadSide ?? '';
    }
  }

  select_trackerStatus() {
    const status = this.finalProcessForm.get('tracker_status')?.value;

    if (status === 'AWAITING CUSTOMER COMPLIANCE / RETURN ORDER' || status === 'CANCELLED') {
      this.return_order = true;
      
    } else {
      this.return_order = false;
      this.finalProcessForm.get('reason')?.setValue('');
    }

    if (status === 'ENERGIZED') {
      this.isEnergized = true;
      
    } else {
      this.isEnergized = false;
      this.finalProcessForm.get('date_energized')?.setValue('');
    }
  }

  dismissModal() {
    if (!this.alertError) {
      this.router.navigate([this.link]);
    }
  }

  getWorkflow() {
    this.workflowService.getWorkflowByCtrlno(this.ctrlno).subscribe((workflow) => {
      this.workflow = workflow;

      this.workflow_id = workflow.client_details.id;

      this.clientDetailsForm.patchValue({
        id: this.workflow.client_details.id,
        fname: this.workflow.client_details.client_fname,
        mname: this.workflow.client_details.client_mname,
        lname: this.workflow.client_details.client_lname,
        address: this.workflow.client_details.client_address,
        contact_no: this.workflow.client_details.client_contact_no,
        date_received: this.workflow.client_details.date_received,
        initial_communicator: this.workflow.client_details.initial_communicator,
      });

      this.preSurveyForm.patchValue({
        id: this.workflow.pre_survey.id,
        facility: this.workflow.pre_survey.facility,
        structural_classification: this.workflow.pre_survey.structural_classification,
        service_data: this.workflow.pre_survey.service_data,
        private_pole: this.workflow.pre_survey.private_pole,
        number_of_units: this.workflow.pre_survey.number_of_units,
        feasibility: this.workflow.pre_survey.feasibility,
        plus_code: this.workflow.pre_survey.plus_code,
        remarks: this.workflow.pre_survey.remarks,
      });

      this.documentsForm.patchValue({
        id: this.workflow.documents.id,
        complete_mark: this.workflow.documents.complete_mark,
        remarks: this.workflow.documents.remarks,
      });

      this.paymentForm.patchValue({
        id: this.workflow.payment.id,
        package_price: this.workflow.payment.package_price,
        payment_mark: this.workflow.payment.payment_mark,
        amount: this.workflow.payment.amount,
        down_payment: this.workflow.payment.down_payment,
        balance: this.workflow.payment.balance,
        ar_or_number: this.workflow.payment.ar_or_number,
        remarks: this.workflow.payment.remarks,
      });

      this.jobOrderForm.patchValue({
        id: this.workflow.job_order.id,
        remarks: this.workflow.job_order.remarks,
      });

      this.loadSideForm.patchValue({
        id: this.workflow.load_side.id,
        load_side_mark: this.workflow.load_side.load_side_mark,
        remarks: this.workflow.load_side.remarks,
      });

      this.finalProcessForm.patchValue({
        id: this.workflow.final_processing.id,
        coordinator: this.workflow.final_processing.coordinator,
        cbm_no: this.workflow.final_processing.cbm_no,
        case_no: this.workflow.final_processing.case_no,
        sin_no: this.workflow.final_processing.sin_no,
        tracker_status: this.workflow.final_processing.tracker_status,
        reason: this.workflow.final_processing.reason,
      });

      if(this.workflow.final_processing.tracker_status === 'CANCELLED' || this.workflow.final_processing.tracker_status === 'AWAITING CUSTOMER COMPLIANCE / RETURN ORDER') {
        this.return_order = true;
      }
    });
  }

  submitForm() {
    let formData = new FormData();

    if(this.step === 'client_details') {
      const values = this.clientDetailsForm.value;

      for (const key of Object.keys(values)) {
        formData.append(key, values[key]);
      }
    }

    else if(this.step === 'pre_survey') {
      const values = this.preSurveyForm.value;

      for (const key of Object.keys(values)) {
        if(key === 'pre_survey') {
          const images = this.selectedFilePreSurvey;
  
          if(images) {
            for( let img of images) {
              formData.append(key, img);
            }
          }
          
        }

        else if(key === 'structural_classification') {
          if(values[key] === 'OTHERS') {
            formData.append('other_structural_classification', this.other_structural_classification);
          }
          formData.append(key, values[key]);
        }

        else if(key === 'service_data') {
          if(values[key] === 'OTHERS') {
            formData.append('other_service_data', this.other_service_data);
          }
          formData.append(key, values[key]);
        }

        else  {
          formData.append(key, values[key]);
        }
      }
    }

    else if(this.step === 'documents') {
      const values = this.documentsForm.value;

      for (const key of Object.keys(values)) {
        if(key === 'documents') {
          const images = this.selectedFileDocuments;
  
          if (images) {
            for( let img of images) {
              formData.append(key, img);
            }
          }
          
        }
        else {
          formData.append(key, values[key]);
        }
      }
    } 

    else if(this.step === 'payment') {
      const values = this.paymentForm.value;

      for (const key of Object.keys(values)) {
        formData.append(key, values[key]);
      }
    }

    else if(this.step === 'job_order') {
      const values = this.jobOrderForm.value;

      for (const key of Object.keys(values)) {
        if(key === 'job_order') {
          const images = this.selectedFileJobOrder;
  
          if (images) {
            for( let img of images) {
              formData.append(key, img);
            }
          }
          
        }
        else {
          formData.append(key, values[key]);
        }
      }
    }

    else if(this.step === 'load_side') {
      const values = this.loadSideForm.value;

      for (const key of Object.keys(values)) {
        if(key === 'load_side') {
          const images = this.selectedFileLoadSide;
  
          if (images) {
            for( let img of images) {
              formData.append(key, img);
            }
          }
          
        }

        else if(key === 'load_side_mark') {
          if(values[key] === 'OTHERS') {
            formData.append('other_load_side', this.other_load_side);
          }
          formData.append(key, values[key]);
        }

        else {
          formData.append(key, values[key]);
        }
      }
    }

    else if(this.step === 'final_process') {
      const values = this.finalProcessForm.value;

      for (const key of Object.keys(values)) {
        formData.append(key, values[key]);
      }
    }

    this.workflowService.updateWorkflow(formData, this.workflow_id, this.step).subscribe(msg =>{
      this.alertTitle = 'Update Work Flow';
      this.alertMessage = msg.message;
      
      this.loadingService.hideLoader();
      document.getElementById('update-open-modal')?.click();
  
      this.alertError = msg.error;
    });
  }

  changePaymentMark() {
    const payment_mark = this.paymentForm.get('payment_mark')?.value;

    if(payment_mark === 'Full Payment') {
      this.full_payment = true;
    }

    else {
      this.full_payment = false;
    }

    this.paymentForm.patchValue({
      amount: 0,
      down_payment: 0,
      balance: 0
    })
  }
}
