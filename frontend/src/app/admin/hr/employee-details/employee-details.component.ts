import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Employees } from 'src/app/models/employee';
import { AdminServicesService } from 'src/app/services/admin-services/admin-services.service';
import { EmployeesService } from 'src/app/services/employee-service/employees.service';

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-employee-details',
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.css']
})
export class EmployeeDetailsComponent implements OnInit {
  isSideNavCollapsed = false;
  screenWidth = 0;

  id: any;

  staff: Employees | any;

  disabled: boolean = true;

  editForm!: FormGroup;
  tempDetails!: FormGroup;

  department!: any;

  superadmin = false;
  hr = false;
  accounting = false;
  engineering = false;

  token: any;

  name: string=  '';

  employeeName: string = '';

  resigned: boolean = false;

  alertTitle: string = '';
  alertMessage: string = '';

  constructor(private activatedRoute: ActivatedRoute, private employeeService: EmployeesService, private adminService: AdminServicesService){
    this.id = this.activatedRoute.snapshot.params['id'];
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

    this.editForm =  this.createForm();

    this.tempDetails =  this.createTempForm();

    this.getEmployee();
  }

  createForm(): FormGroup {
    return new FormGroup({
      emp_id: new FormControl({ value: '', disabled: true }),
      fname: new FormControl({ value: '', disabled: true }),
      mname: new FormControl({ value: '', disabled: true }),
      lname: new FormControl({ value: '', disabled: true }),
      contact_number: new FormControl({ value: '', disabled: true }),
      email_address: new FormControl({ value: '', disabled: true }),
      address: new FormControl({ value: '', disabled: true }),
      tin: new FormControl({ value: '', disabled: true }),
      sss: new FormControl({ value: '', disabled: true }),
      philhealth: new FormControl({ value: '', disabled: true }),
      pagibig: new FormControl({ value: '', disabled: true }),
      emergency_contact_name: new FormControl({ value: '', disabled: true }),
      emergency_contact_number: new FormControl({ value: '', disabled: true }),
      beneficiary: new FormControl({ value: '', disabled: true }),
      position: new FormControl({ value: '', disabled: true }),
      sin_number: new FormControl({ value: '', disabled: true }),
      status: new FormControl({ value: '', disabled: true })
    });
  }

  createTempForm(): FormGroup {
    return new FormGroup({
      emp_id: new FormControl(''),
      fname: new FormControl(''),
      mname: new FormControl(''),
      lname: new FormControl(''),
      contact_number: new FormControl(''),
      email_address: new FormControl(''),
      address: new FormControl(''),
      tin: new FormControl(''),
      sss: new FormControl(''),
      philhealth: new FormControl(''),
      pagibig: new FormControl(''),
      emergency_contact_name: new FormControl(''),
      emergency_contact_number: new FormControl(''),
      beneficiary: new FormControl(''),
      position: new FormControl(''),
      sin_number: new FormControl(''),
      status: new FormControl('')
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

  update() {
    this.tempDetails.patchValue(this.editForm.value);
    
    Object.keys(this.editForm.controls).forEach(key => {
        this.editForm.get(key)?.enable();
    });

    this.editForm.get('status')?.disable();
    
    this.disabled = !this.disabled;
  }

  updateDetails() {
    
    this.employeeService.updateEmployee(this.editForm.value, this.staff.id).subscribe((msg) => {
      this.alertTitle = 'Update Admin';
      this.alertMessage = msg.message;

      document.getElementById('emp-open-modal')?.click();

      if(!msg.error) {
        this.id = this.editForm.get('emp_id')?.value;
        this.editForm.disable();
        this.disabled = true;
      }
      this.getEmployee();
    });
    
  }

  cancelUpdate() {
    this.editForm.patchValue(this.tempDetails.value);
    this.editForm.disable();
    this.disabled = true;
  }

  getEmployee(): void {
    this.employeeService.getEmployeeById(this.id).subscribe(employee => {
      this.staff = employee;

      this.employeeName = this.staff.fname + ' ' + this.staff.lname;

      if(this.staff.status === 'Resigned') {
        this.resigned = true;
      }
      else {
        this.resigned = false;
      }

      this.editForm.patchValue({
        emp_id: this.staff.emp_id,
        fname: this.staff.fname,
        mname: this.staff.mname,
        lname: this.staff.lname,
        contact_number: this.staff.contact_number,
        email_address: this.staff.email_address,
        address: this.staff.address,
        tin: this.staff.tin,
        sss: this.staff.sss,
        philhealth: this.staff.philhealth,
        pagibig: this.staff.pagibig,
        emergency_contact_name: this.staff.emergency_contact_name,
        emergency_contact_number: this.staff.emergency_contact_number,
        beneficiary: this.staff.beneficiary,
        position: this.staff.position,
        sin_number: this.staff.sin_number,
        status: this.staff.status
      });
    });
  }

  resignEmployee() {
    this.employeeService.updateEmployeeStatus('Resigned', this.staff.id).subscribe((msg) => {
      document.getElementById('emp-resign-close-btn')?.click();

      this.alertTitle = 'Resign Employee';
      this.alertMessage = msg.message;

      document.getElementById('emp-open-modal')?.click();

      this.getEmployee();
    });
  }

  activateEmployee() {
    this.employeeService.updateEmployeeStatus('Active', this.staff.id).subscribe((msg) => {
      document.getElementById('emp-active-close-btn')?.click();

      this.alertTitle = 'Activate Employee';
      this.alertMessage = msg.message;

      document.getElementById('emp-open-modal')?.click();

      this.getEmployee();
    });
  }
}
