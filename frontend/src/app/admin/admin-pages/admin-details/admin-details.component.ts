import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Admin } from 'src/app/models/admin';
import { AdminServicesService } from 'src/app/services/admin-services/admin-services.service';

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-admin-details',
  templateUrl: './admin-details.component.html',
  styleUrls: ['./admin-details.component.css']
})
export class AdminDetailsComponent implements OnInit {
  isSideNavCollapsed = false;
  screenWidth = 0;

  id: any;

  admin: Admin | any;

  disabled: boolean = true;

  editForm!: FormGroup;
  tempDetails!: FormGroup;

  department!: any;

  superadmin = false;
  hr = false;
  accounting = false;
  engineering = false;

  token: any;

  name: string =  '';

  adminName: string = '';

  resigned: boolean = false;

  link: string = '';

  alertTitle: string = '';
  alertMessage: string = '';

  constructor(private activatedRoute: ActivatedRoute, private adminService: AdminServicesService){
    this.id = this.activatedRoute.snapshot.params['id'];
    this.link = '/admin/list/details/permissions/' + this.id;
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

    this.getAdmin();
  }

  createForm(): FormGroup {
    return new FormGroup({
      id: new FormControl({ value: '', disabled: true }),
      fname: new FormControl({ value: '', disabled: true }),
      mname: new FormControl({ value: '', disabled: true }),
      lname: new FormControl({ value: '', disabled: true }),
      position: new FormControl({ value: '', disabled: true }),
      department: new FormControl({ value: '', disabled: true }),
      status: new FormControl({ value: '', disabled: true })
    });
  }

  createTempForm(): FormGroup {
    return new FormGroup({
      id: new FormControl(''),
      fname: new FormControl(''),
      mname: new FormControl(''),
      lname: new FormControl(''),
      position: new FormControl(''),
      department: new FormControl(''),
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

  getAdmin(): void {
    this.adminService.getAdminByEmployeeId(this.id).subscribe(ads => {
      this.admin = ads;

      this.adminName = this.admin.fname + ' ' + this.admin.lname;

      if(this.admin.status === 'Resigned') {
        this.resigned = true;
      }
      else {
        this.resigned = false;
      }

      this.editForm.patchValue({
        id: this.admin.id,
        fname: this.admin.fname,
        mname: this.admin.mname,
        lname: this.admin.lname,
        position: this.admin.position,
        department: this.admin.department,
        status: this.admin.status
      });
    });
  }

  update() {
    this.tempDetails.patchValue(this.editForm.value);

    this.editForm.get('position')?.enable();
    this.editForm.get('department')?.enable();
    
    this.disabled = !this.disabled;
  }

  updateDetails() {
    this.adminService.updateAdminPosDep(this.editForm.value, this.id).subscribe((msg) => {
      this.alertTitle = 'Update Admin';
      this.alertMessage = msg.message;

      document.getElementById('open-modal')?.click();
    });
    this.editForm.disable();
    this.disabled = true;
  }

  cancelUpdate() {
    this.editForm.patchValue(this.tempDetails.value);
    this.editForm.disable();
    this.disabled = true;
  }

  resignAdmin() {
    this.adminService.updateAdminStatus('Resigned', this.id).subscribe((msg) => {
      document.getElementById('resign-close-btn')?.click();

      this.alertTitle = 'Resign Admin';
      this.alertMessage = msg.message;

      document.getElementById('open-modal')?.click();

      this.getAdmin();
    });
  }

  activateAdmin() {
    this.adminService.updateAdminStatus('Active', this.id).subscribe((msg) => {
      document.getElementById('active-close-btn')?.click();

      this.alertTitle = 'Activate Admin';
      this.alertMessage = msg.message;

      document.getElementById('open-modal')?.click();

      this.getAdmin();
    });
  }

}
