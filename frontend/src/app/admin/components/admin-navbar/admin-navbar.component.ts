import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminServicesService } from 'src/app/services/admin-services/admin-services.service';

@Component({
  selector: 'app-admin-navbar',
  templateUrl: './admin-navbar.component.html',
  styleUrls: ['./admin-navbar.component.css']
})
export class AdminNavbarComponent implements OnInit {

  @Input() department: String = '';

  superadmin = false;
  hr = false;
  accounting = false;
  engineering = false;

  token: any;

  constructor(private router: Router, private adminService: AdminServicesService) {}

  ngOnInit(): void {

    //get the details of the admin
    this.token = this.adminService.getTokenDetails();

    //set the details of the admin if retrieved
    if(this.token) {
      const id = this.token.adminId;
      this.adminService.getAdminById(id).subscribe(admin => {
        this.department = admin.department;
        this.setDisabledNavs();
      });
    }
  }

  //logout admin
  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['admin/login']);
  }

  //set which admin is logged in to enable related navbar menu
  setDisabledNavs() {
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

  //disable inventory menu if admin is not from accounting department
  nonAccountingClass(): string {
    if (!this.accounting && !this.superadmin) {
      return 'disabled';
    }
    else {
      return '';
    }
  }

  //disable staffs menu if admin is not from hr department
  nonHrClass(): string {
    if (!this.hr && !this.superadmin) {
      return 'disabled';
    }
    else {
      return '';
    }
  }

  //disable engineering menu if admin is not from engineering department
  nonEngineeringClass(): string {
    if (!this.engineering && !this.superadmin) {
      return 'disabled';
    }
    else {
      return '';
    }
  }

  nonSuperAdminClass(): string {
    if (!this.superadmin) {
      return 'disabled';
    }
    else {
      return '';
    }
  }
}
