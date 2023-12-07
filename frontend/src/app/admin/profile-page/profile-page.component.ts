import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validator, Validators } from '@angular/forms';
import { AdminServicesService } from 'src/app/services/admin-services/admin-services.service';

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent implements OnInit {

  isSideNavCollapsed = false;
  screenWidth = 0;

  id: any;

  staff: any;

  disabled: boolean = true;

  department!: any;
  superadmin = false;
  hr = false;
  accounting = false;
  engineering = false;

  profileForm!: FormGroup;
  tempDetails!: FormGroup;
  changePasswordForm!: FormGroup;

  token: any;

  error_message = '';
  error: boolean = false;

  name: string = '';

  alertTitle: string = '';
  alertMessage: string = '';

  constructor(private adminService: AdminServicesService) {}

  ngOnInit(): void {
    this.profileForm = this.createForm();
    this.tempDetails = this.createTempForm();
    this.changePasswordForm = this.createChangePasswordForm();

     //get the details of the admin
     this.token = this.adminService.getTokenDetails();

     //set the details of the admin if retrieved
     if(this.token) {
       this.id = this.token.adminId;
       this.adminService.getAdminById(this.id).subscribe(admin => {
         this.department = admin.department;
         this.setActiveDepartment();
         
         this.getAdmin();
       });
     }


  }

  createForm(): FormGroup {
    return new FormGroup({
      employeeId: new FormControl({ value: '', disabled: true }),
      fname: new FormControl({ value: '', disabled: true }),
      mname: new FormControl({ value: '', disabled: true }),
      lname: new FormControl({ value: '', disabled: true }),
      contact_number: new FormControl({ value: '', disabled: true }),
      email_address: new FormControl({ value: '', disabled: true }),
      address: new FormControl({ value: '', disabled: true }),
      emergency_contact_name: new FormControl({ value: '', disabled: true }),
      emergency_contact_number: new FormControl({ value: '', disabled: true }),
      beneficiary: new FormControl({ value: '', disabled: true }),
      position: new FormControl({ value: '', disabled: true }),
      department: new FormControl({ value: '', disabled: true }),
      username: new FormControl({ value: '', disabled: true })
    });
  }

  createTempForm(): FormGroup {
    return new FormGroup({
      employeeId: new FormControl(''),
      fname: new FormControl(''),
      mname: new FormControl(''),
      lname: new FormControl(''),
      contact_number: new FormControl(''),
      email_address: new FormControl(''),
      address: new FormControl(''),
      emergency_contact_name: new FormControl(''),
      emergency_contact_number: new FormControl(''),
      beneficiary: new FormControl(''),
      position: new FormControl(''),
      department: new FormControl(''),
      username: new FormControl('')
    });
  }

  createChangePasswordForm(): FormGroup {
    return new FormGroup({
      old_password: new FormControl('', Validators.required),
      new_password: new FormControl('', Validators.required),
      confirm_password: new FormControl('', Validators.required)
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

  update() {
    this.tempDetails.patchValue(this.profileForm.value);
    
    Object.keys(this.profileForm.controls).forEach(key => {
      if (key !== 'id') {
        this.profileForm.get(key)?.enable();
      }
    });
    
    this.disabled = !this.disabled;
  }

  updateDetails() {
    this.adminService.updateAdmin(this.profileForm.value, this.id).subscribe((msg) => {
      this.alertTitle = 'Update Admin';
      this.alertMessage = msg.message;

      document.getElementById('open-modal')?.click();
      
      if(!msg.error) {
        this.getAdmin();
        this.profileForm.disable();
        this.disabled = true;
      }
    });

  }

  cancelUpdate() {
    this.profileForm.patchValue(this.tempDetails.value);
    this.profileForm.disable();
    this.disabled = true;
  }

  getAdmin(): void {
    this.adminService.getAdminById(this.id).subscribe(employee => {
      this.staff = employee;
      this.name = 'Hello, ' + this.staff.fname;

      this.profileForm.patchValue({
        employeeId: this.staff.employeeId,
        fname: this.staff.fname,
        mname: this.staff.mname,
        lname: this.staff.lname,
        contact_number: this.staff.contact_number,
        email_address: this.staff.email_address,
        address: this.staff.address,
        emergency_contact_name: this.staff.emergency_contact_name,
        emergency_contact_number: this.staff.emergency_contact_number,
        beneficiary: this.staff.beneficiary,
        position: this.staff.position,
        department: this.staff.department,
        username: this.staff.username
      });
    });
  }

  changePassword() {
    const old_password = this.changePasswordForm.get('old_password')?.value;
    const new_password = this.changePasswordForm.get('new_password')?.value;
    const confirm_password = this.changePasswordForm.get('confirm_password')?.value;

    if(old_password === '' || new_password === '' || confirm_password === '' || old_password === null || new_password === null || confirm_password === null) {
      this.error_message = "Please fill all fields.";
      this.error = true;
      return;
    }

    if(new_password !== confirm_password) {

      this.error_message = "new passwords didn't match.";
      this.error = true;
      this.changePasswordForm.reset();
      return;
    }

    this.adminService.changePassword(this.changePasswordForm.value, this.id).subscribe((msg) => {
      
      this.changePasswordForm.reset();
      if(msg.error) {
        this.error_message = msg.message;
        this.error = true;
      }
      else {
        this.error_message = '';
        this.error = false;
        document.getElementById('close-btn')?.click();

        this.alertTitle = 'Success';
        this.alertMessage = msg.message;

        document.getElementById('open-modal')?.click();

      }
      
    });
  }

  cancelChangepassword() {
    this.changePasswordForm.reset();
  }

}
