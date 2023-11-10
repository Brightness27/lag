import { Component, OnInit } from '@angular/core';
import { Admin } from 'src/app/models/admin';
import { AdminServicesService } from 'src/app/services/admin-services/admin-services.service';

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css']
})
export class AdminHomeComponent implements OnInit {
  isSideNavCollapsed = false;
  screenWidth = 0;

  department!: any;
  showNav = true;
  superadmin = false;
  hr = false;
  accounting = false;
  engineering = false;

  token: any;

  name: string = '';

  constructor(private adminService: AdminServicesService) {}

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
  }

  //set which admin is logged in
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
}
