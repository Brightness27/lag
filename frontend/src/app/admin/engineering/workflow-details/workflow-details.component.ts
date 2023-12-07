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

  updating = false;

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

  constructor(private activatedRoute: ActivatedRoute,private adminService: AdminServicesService, private workflowService: WorkflowService, private builder: FormBuilder, private datePipe: DatePipe){
    this.id = this.activatedRoute.snapshot.params['id'];
  }

  work_flow = this.builder.group({
    client_details: this.builder.group({
      id: this.builder.control({ value: '', disabled: true }, Validators.required),
      name: this.builder.control({ value: '', disabled: true }, Validators.required),
      address: this.builder.control({ value: '', disabled: true }, Validators.required),
      contact_no: this.builder.control({ value: '', disabled: true }, Validators.required),
      date_received: this.builder.control({ value: '', disabled: true }, Validators.required)
    }),

    pre_survey: this.builder.group({
      id: this.builder.control({ value: '', disabled: true }, Validators.required),
      facility: this.builder.control({ value: '', disabled: true }, Validators.required),
      structural_classification: this.builder.control({ value: '', disabled: true }, Validators.required),
      service_data: this.builder.control({ value: '', disabled: true }, Validators.required),
      private_pole: this.builder.control({ value: '', disabled: true }, Validators.required),
      number_of_units: this.builder.control({ value: '', disabled: true }, Validators.required),
      feasibility: this.builder.control({ value: '', disabled: true }, Validators.required),
      plus_code: this.builder.control({ value: '', disabled: true }, Validators.required),
      remarks: this.builder.control({ value: '', disabled: true }, Validators.required)
    }),

    documents: this.builder.group({
      id: this.builder.control({ value: '', disabled: true }, Validators.required),
      complete_mark: this.builder.control({ value: '', disabled: true }, Validators.required),
      remarks: this.builder.control({ value: '', disabled: true }, Validators.required)
    }),

    payment: this.builder.group({
      id: this.builder.control({ value: '', disabled: true }, Validators.required),
      payment_mark: this.builder.control({ value: '', disabled: true }, Validators.required),
      ar_or_number: this.builder.control({ value: '', disabled: true }, Validators.required),
      remarks: this.builder.control({ value: '', disabled: true }, Validators.required)
    }),

    job_order: this.builder.group({
      id: this.builder.control({ value: '', disabled: true }, Validators.required),
      remarks: this.builder.control({ value: '', disabled: true }, Validators.required)
    }),

    load_side: this.builder.group({
      id: this.builder.control({ value: '', disabled: true }, Validators.required),
      load_side_mark: this.builder.control({ value: '', disabled: true }, Validators.required),
      remarks: this.builder.control({ value: '', disabled: true }, Validators.required)
    }),

    final_processing: this.builder.group({
      id: this.builder.control({ value: '', disabled: true }, Validators.required),
      coordinator: this.builder.control({ value: '', disabled: true }, Validators.required)
    })
  });

  work_flow_temp = this.builder.group({
    client_details: this.builder.group({
      id: this.builder.control(''),
      name: this.builder.control(''),
      address: this.builder.control(''),
      contact_no: this.builder.control(''),
      date_received: this.builder.control('')
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
      remarks: this.builder.control('')
    }),

    documents: this.builder.group({
      id: this.builder.control(''),
      complete_mark: this.builder.control(''),
      remarks: this.builder.control('')
    }),

    payment: this.builder.group({
      id: this.builder.control(''),
      payment_mark: this.builder.control(''),
      ar_or_number: this.builder.control(''),
      remarks: this.builder.control('')
    }),

    job_order: this.builder.group({
      id: this.builder.control(''),
      remarks: this.builder.control('')
    }),

    load_side: this.builder.group({
      id: this.builder.control(''),
      load_side_mark: this.builder.control(''),
      remarks: this.builder.control('')
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

update() {
  const workflow_temp_value = {
    client_details: {
      id: this.work_flow.get('client_details.id')?.value || null,
      name: this.work_flow.get('client_details.name')?.value || null,
      address: this.work_flow.get('client_details.address')?.value || null,
      contact_no: this.work_flow.get('client_details.contact_no')?.value || null,
      date_received: this.work_flow.get('client_details.date_received')?.value || null
    },

    pre_survey: {
      id: this.work_flow.get('pre_survey.id')?.value || null,
      facility: this.work_flow.get('pre_survey.facility')?.value || null,
      structural_classification: this.work_flow.get('pre_survey.structural_classification')?.value || null,
      service_data: this.work_flow.get('pre_survey.service_data')?.value || null,
      private_pole: this.work_flow.get('pre_survey.private_pole')?.value || null,
      number_of_units: this.work_flow.get('pre_survey.number_of_units')?.value || null,
      feasibility: this.work_flow.get('pre_survey.feasibility')?.value || null,
      plus_code: this.work_flow.get('pre_survey.plus_code')?.value || null,
      remarks: this.work_flow.get('pre_survey.remarks')?.value || null
    },

    documents: {
      id: this.work_flow.get('documents.id')?.value || null,
      complete_mark: this.work_flow.get('documents.complete_mark')?.value || null,
      remarks: this.work_flow.get('documents.remarks')?.value || null
    },

    payment: {
      id: this.work_flow.get('payment.id')?.value || null,
      payment_mark: this.work_flow.get('payment.payment_mark')?.value || null,
      ar_or_number: this.work_flow.get('payment.ar_or_number')?.value || null,
      remarks: this.work_flow.get('payment.remarks')?.value || null
    },

    job_order: {
      id: this.work_flow.get('job_order.id')?.value || null,
      remarks: this.work_flow.get('job_order.remarks')?.value || null
    },

    load_side: {
      id: this.work_flow.get('load_side.id')?.value || null,
      load_side_mark: this.work_flow.get('load_side.load_side_mark')?.value || null,
      remarks: this.work_flow.get('load_side.remarks')?.value || null
    },

    final_processing: {
      id: this.work_flow.get('final_processing.id')?.value || null,
      coordinator: this.work_flow.get('final_processing.coordinator')?.value || null
    }
  }
  this.work_flow_temp.setValue(workflow_temp_value);
  
  this.work_flow.enable();
  document.getElementById('reset-stepper')?.click();
  this.updating = true;
}

cancelUpdate() {
  this.work_flow.patchValue(this.work_flow_temp.value);
  this.work_flow.disable();
  this.updating = false;
}

updateWorkflow() {
  const selectedDate = this.work_flow.get('client_details.date_received')?.value;
    const formattedDate = this.datePipe.transform(selectedDate, 'yyyy-MM-dd');

    this.work_flow.patchValue({
      client_details: {
        date_received: formattedDate
      }
    })
  
  this.workflowService.updateWorkflow(this.work_flow.value).subscribe(msg =>{
    this.alertTitle = 'Update Work Flow';
    this.alertMessage = msg.message;
    
    document.getElementById('update-open-modal')?.click();

    if(!msg.error) {
      this.getWorkflow();
      this.work_flow.disable();
      this.updating = false;
      document.getElementById('reset-stepper')?.click();
    }
  });
}

get clientDetails() {
  return this.work_flow.get('client_details') as FormGroup;
}

getWorkflow() {
  this.workflowService.getWorkflowById(this.id).subscribe(workflow => {
    this.workflow = workflow;

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
        structural_classification: this.workflow.pre_survey.structural_classification,
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
    
    console.log(this.work_flow.value);
    
  });
}

}
