import { Component, HostListener, OnInit } from '@angular/core';
import { faUserPlus, faSearch, faPrint } from '@fortawesome/free-solid-svg-icons';

import { EmployeesService } from 'src/app/services/employee-service/employees.service';
import { AdminServicesService } from 'src/app/services/admin-services/admin-services.service';

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css']
})
export class EmployeesComponent implements OnInit {

  isSideNavCollapsed = false;
  screenWidth = 0;

  hideAddText = true;

  activeEmployees: any[] = [];
  resignedEmployees: any[] = [];

  addEmployee = faUserPlus;
  printList = faPrint;

  search = faSearch;
  searchKey: string = "";

  department!: any;
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

  constructor(private employeeService: EmployeesService, private adminService: AdminServicesService) {}

  ngOnInit(): void {
    this.token = this.adminService.getTokenDetails();

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

    document.getElementById('emp-activebtn')?.click();
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

  getAllEmployees(): void {
    this.employeeService.getAllEmployees(this.status).subscribe((employees) => {
      
      if(this.status == 'Active') {
        this.activeEmployees = employees.map(employee => {
          return {
            ...employee,
            link: '/admin/employees/list/details/' + employee.emp_id
          };
        });
      }
      else if (this.status == 'Resigned') {
        this.resignedEmployees = employees.map(employee => {
          return {
            ...employee,
            link: '/admin/employees/list/details/' + employee.emp_id
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
      this.getAllEmployees();
    }
    else {
      this.employeeService.searchEmployees(this.searchKey, this.status).subscribe((employees) => {
      
        if(this.status == 'Active') {
          this.activeEmployees = employees.map(employee => {
            return {
              ...employee,
              link: '/admin/employees/list/details/' + employee.emp_id
            };
          });
        }
        else if (this.status == 'Resigned') {
          this.resignedEmployees = employees.map(employee => {
            return {
              ...employee,
              link: '/admin/employees/list/details/' + employee.emp_id
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
  this.getAllEmployees();
  }

}
