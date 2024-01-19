import { Component, HostListener, OnInit, ViewChildren } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AdminServicesService } from 'src/app/services/admin-services/admin-services.service';
import { WorkflowService } from 'src/app/services/workflow-services/workflow.service';
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

  developer = false;
  new_location = false;

  alertTitle: string = '';
  alertMessage: string = '';
  alertError: boolean = false;

  link = '';

  addForm!: FormGroup;

  screen_width!: number;

  locations: any[] = [];

  currentDate!: string | null;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screen_width = window.innerWidth;
  }

  permissionGranted: boolean = false;

  constructor(private router: Router, private adminService: AdminServicesService, private builder: FormBuilder, private workflowService: WorkflowService, private datePipe: DatePipe, private loadingService: LoadingService) {
    this.currentDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  }

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

     this.screen_width = window.innerWidth;

     this.addForm = this.createFormGroup();

     this.getPermissions();
     this.getLocations();
  }

  getPermissions() {
    this.adminService.getAdminPermissions(this.id).subscribe(permissions => {
      if(permissions.client_details) {
        this.permissionGranted = true;
      }
      
    });
  }

  createFormGroup(): FormGroup {
    return new FormGroup({
      fname: new FormControl(''),
      mname: new FormControl(''),
      lname: new FormControl(''),
      address: new FormControl(''),
      contact_no: new FormControl(''),
      date_received: new FormControl('', Validators.required),
      category: new FormControl(''),
      developer_location: new FormControl(''),
      new_location: new FormControl(''),
      initial_communicator: new FormControl('')
    });
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

  getLocations() {
    this.workflowService.getAllLocations().subscribe(locations => {
      this.locations = locations;
    });
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

  select_category() {
    const category = this.addForm.get('category')?.value;
    
    if (category === 'DEVELOPER') {
      this.developer = true;
      
    } else {
      this.developer = false;
      this.addForm.get('developer_location')?.setValue('');

      this.new_location = false;
      this.addForm.get('new_location')?.setValue('');
    }
  }

  select_locations() {
    const location = this.addForm.get('developer_location')?.value;
    
    if (location === 'OTHER') {
      this.new_location = true;
      
    } else {
      this.new_location = false;
      this.addForm.get('new_location')?.setValue('');
    }
  }


  submitForm() {
    this.loadingService.showLoader();

    this.workflowService.addWorkflow(this.addForm.value).subscribe(msg => {
      this.alertTitle = 'Add Work Flow';
      this.alertMessage = msg.message;
      this.alertError = msg.error;
      this.link = '/admin/engineering/work-flow/details/' + msg.ctrlno;

      document.getElementById('open-modal')?.click();

      this.loadingService.hideLoader();
    });
  }

  dismissModal() {
    if(!this.alertError) {
      this.router.navigate([this.link]);
    }
  }
}
