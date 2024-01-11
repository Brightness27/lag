import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AdminServicesService } from 'src/app/services/admin-services/admin-services.service';

import { EmployeesService } from 'src/app/services/employee-service/employees.service';

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-add-admin',
  templateUrl: './add-admin.component.html',
  styleUrls: ['./add-admin.component.css']
})
export class AddAdminComponent implements OnInit {

  isSideNavCollapsed = false;
  screenWidth = 0;

  employees: any[] = [];

  department!: any;
  superadmin = false;
  hr = false;
  accounting = false;
  engineering = false;

  addForm!: FormGroup;

  token: any;
  admin_id: any;

  name: string = '';

  alertTitle: string = '';
  alertMessage: string = '';

  constructor(private employeeService: EmployeesService, private adminService: AdminServicesService) {}

  ngOnInit(): void {
    //initalize the formGroup to bind the form element
    this.addForm = this.createFormGroup();

     //get the details of the admin
     this.token = this.adminService.getTokenDetails();

     //set the details of the admin if retrieved
     if(this.token) {
       this.admin_id = this.token.adminId;
       this.adminService.getAdminById(this.admin_id).subscribe(admin => {
         this.department = admin.department;
         this.name = 'Hello, ' + admin.fname;
         this.setActiveDepartment();
       });
     }

    this.getAllEmployees();
  }

  //create formGroup
  createFormGroup(): FormGroup {
    return new FormGroup({
      employeeId: new FormControl(''),
      department: new FormControl(''),
      username: new FormControl(''),
      password: new FormControl('')
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

  getAllEmployees(): void {
    this.employeeService.getAllEmployees('Active').subscribe((employees) => {
      
      this.employees = employees.map(employee => {
        return {
          ...employee,
          fullName: employee.fname + " " + employee.mname + " " + employee.lname
        };
      });
    });
  }

  //send the form to the backend to add the new admin to the database
  submit() {  
    this.adminService.addAdmin(this.addForm.value).subscribe((msg) => {
      this.alertTitle = 'Add Admin';
      this.alertMessage = msg.message;

      document.getElementById('open-modal')?.click();
    });
  }
}
