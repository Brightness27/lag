import { Component, HostListener, OnInit } from '@angular/core';
import { AdminServicesService } from 'src/app/services/admin-services/admin-services.service';

import { faUserPlus, faSearch } from '@fortawesome/free-solid-svg-icons';

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-admin-list',
  templateUrl: './admin-list.component.html',
  styleUrls: ['./admin-list.component.css']
})
export class AdminListComponent implements OnInit {
  isSideNavCollapsed = false;
  screenWidth = 0;

  hideAddText = true;

  activeAdmins: any[] = [];
  resignedAdmins: any[] = [];
  addAdmin = faUserPlus;
  
  search = faSearch;
  searchKey: string = "";

  department!: any;
  showNav = true;
  superadmin = false;
  hr = false;
  accounting = false;
  engineering = false;

  token: any;

  name: string = '';

  active_class: string = '';
  resigned_class: string = '';

  status: string = '';

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if(window.innerWidth > 768) {
      this.hideAddText = true;
    }
    else if(window.innerWidth <= 768 && window.innerWidth > 0) {
      this.hideAddText = false;
    }
  }

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

    if(window.innerWidth > 768) {
      this.hideAddText = true;
    }
    else if(window.innerWidth <= 768 && window.innerWidth > 0) {
      this.hideAddText = false;
    }

    document.getElementById('ad-activebtn')?.click();
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

  getAllAdmins(): void {
    this.adminService.getAllAdmins(this.status).subscribe((admins) => {
      
      if(this.status == 'Active') {
        this.activeAdmins = admins.map(admin => {
          return {
            ...admin,
            fullName: admin.fname + " " + admin.mname + " " + admin.lname,
            link: '/admin/list/details/' + admin.id
          };
        });
      }
      else if (this.status == 'Resigned') {
        this.resignedAdmins = admins.map(admin => {
          return {
            ...admin,
            fullName: admin.fname + " " + admin.mname + " " + admin.lname,
            link: '/admin/list/details/' + admin.id
          };
        });
      }
    });
  }

  updateSearchKey(event: any) {
    this.searchKey = event.target.value;
  }

  searchEmployees() {
    if(this.searchKey === "") {
      this.getAllAdmins();
    }
    else {
      this.adminService.searchAdmins(this.searchKey, this.status).subscribe((admins) => {
      
        if(this.status == 'Active') {
          this.activeAdmins = admins.map(admin => {
            return {
              ...admin,
              fullName: admin.fname + " " + admin.mname + " " + admin.lname,
              link: '/admin/list/details/' + admin.id
            };
          });
        }
        else if (this.status == 'Resigned') {
          this.resignedAdmins = admins.map(admin => {
            return {
              ...admin,
              fullName: admin.fname + " " + admin.mname + " " + admin.lname,
              link: '/admin/list/details/' + admin.id
            };
          });
        }
      });
    }
  }

  showTab(btnid: string, id: string) {
    var i, tablinks;

  // Get all elements with class="tabcontent" and hide them
  this.active_class = 'hide';
  this.resigned_class = 'hide'

  // Get all elements with class="tablinks" and remove the class "active"
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  // Show the current tab, and add an "active" class to the button that opened the tab
  
  if(id === 'Active') {
    this.active_class = 'show';
  }
  else if(id === 'Resigned') {
    this.resigned_class = 'show';
  }

  this.status = id;

  document.getElementById(btnid)!.className += " active";

  this.searchKey = '';
  this.getAllAdmins();
  }
}