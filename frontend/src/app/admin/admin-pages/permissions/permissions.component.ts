import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Admin } from 'src/app/models/admin';
import { AdminServicesService } from 'src/app/services/admin-services/admin-services.service';

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-permissions',
  templateUrl: './permissions.component.html',
  styleUrls: ['./permissions.component.css']
})
export class PermissionsComponent implements OnInit {

  isSideNavCollapsed = false;
  screenWidth = 0;

  id: any;

  admin: Admin | any;

  admin_id: any;

  department!: any;

  superadmin = false;
  hr = false;
  accounting = false;
  engineering = false;

  token: any;

  name: string =  '';

  link: string = '';

  permissions: any;

  alertTitle: string = '';
  alertMessage: string = '';

  permissionForm!: FormGroup;

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private adminService: AdminServicesService){
    this.id = this.activatedRoute.snapshot.params['id'];
    this.link = '/admin/list/details/' + this.id;
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

    this.permissionForm = this.createForm();

    this.getAdmin();
 }

 createForm(): FormGroup {
  return new FormGroup({
    client_details: new FormControl(false),
    pre_survey: new FormControl(false),
    documents: new FormControl(false),
    payment: new FormControl(false),
    job_order: new FormControl(false),
    load_side: new FormControl(false),
    final_process: new FormControl(false)
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
    this.admin_id = this.admin.admin_id;

    this.getPermissions();
  });
}

getPermissions() {
  this.adminService.getAdminPermissions(this.admin_id).subscribe(permissions => {
    this.permissions = permissions;
    this.permissionForm.patchValue(this.permissions);
  });
}

updatepermissions() {
  console.log(this.permissionForm.value);
  
  this.adminService.updatePersmissions(this.permissionForm.value, this.admin_id).subscribe(permission => {
    this.alertTitle = 'Update Permission';
    this.alertMessage = permission.message;

    document.getElementById('open-modal')?.click();
  });
}

}
