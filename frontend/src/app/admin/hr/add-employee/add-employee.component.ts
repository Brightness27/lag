import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AdminServicesService } from 'src/app/services/admin-services/admin-services.service';

import { EmployeesService } from 'src/app/services/employee-service/employees.service';

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.css']
})
export class AddEmployeeComponent implements OnInit {
  
  isSideNavCollapsed = false;
  screenWidth = 0;

  department!: any;
  superadmin = false;
  hr = false;
  accounting = false;
  engineering = false;

  addForm!: FormGroup;

  token: any;
  name: string = '';

  alertTitle: string = '';
  alertMessage: string = '';

  constructor(private employeeService: EmployeesService, private adminService: AdminServicesService) {}

  ngOnInit(): void {
    //initalize the formGroup to bind the form element
    this.addForm = this.createFormGroup();

    this.token = this.adminService.getTokenDetails();

    if(this.token) {
      const id = this.token.adminId;
      this.adminService.getAdminById(id).subscribe(admin => {
        this.department = admin.department;
        this.name = 'Hello, ' + admin.fname;
        this.setActiveDepartment();
      });
    }
  }

  //create formGroup
  createFormGroup(): FormGroup {
    return new FormGroup({
      id: new FormControl(''),
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
      status: new FormControl('')
    });
  }

  //check the department of admin
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

  //send the form to the backend to add the new employee to the database
  submit() {
    this.employeeService.addEmployee(this.addForm.value).subscribe((msg) => {
      this.alertTitle = 'Add Employee';
      this.alertMessage = msg.message;

      document.getElementById('open-modal')?.click();
    });
  }
}
