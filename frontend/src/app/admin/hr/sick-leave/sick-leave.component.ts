import { Component, HostListener, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { faPlus, faSearch } from '@fortawesome/free-solid-svg-icons';
import { AdminServicesService } from 'src/app/services/admin-services/admin-services.service';
import { EmployeesService } from 'src/app/services/employee-service/employees.service';
import { LeaveService } from 'src/app/services/leave-service/leave.service';

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}
@Component({
  selector: 'app-sick-leave',
  templateUrl: './sick-leave.component.html',
  styleUrls: ['./sick-leave.component.css']
})
export class SickLeaveComponent {
  isSideNavCollapsed = false;
  screenWidth = 0;

  hideAddText = true;

  search = faSearch;
  searchKey: string = "";

  addRecord = faPlus;

  leaveForm!: FormGroup;

  department!: any;
  superadmin = false;
  hr = false;
  accounting = false;
  engineering = false;

  token: any;
  adminId: any;

  name: string = '';

  employees: any[] = [];

  leaves: any[] = [];
  leaveDetails: any = null;

  noLeaveDetails = true;

  unusedLeave = 5;

  alertTitle: string = '';
  alertMessage: string = '';

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if(window.innerWidth > 768) {
      this.hideAddText = true;
    }
    else if(window.innerWidth <= 768 && window.innerWidth > 0) {
      this.hideAddText = false;
    }
  }

  constructor(private employeeService: EmployeesService, private adminService: AdminServicesService, private leaveService: LeaveService) {}

  ngOnInit(): void {

    this.token = this.adminService.getTokenDetails();

    if(this.token) {
      this.adminId = this.token.adminId;
      this.adminService.getAdminById(this.adminId).subscribe(admin => {
        this.department = admin.department;
        this.name = 'Hello, ' + admin.fname;
        this.setActiveDepartment();
      });
    }

    this.leaveForm = this.createForm();
    this.leaveForm.patchValue({
      modified_by: this.adminId
    });

    if(window.innerWidth > 768) {
      this.hideAddText = true;
    }
    else if(window.innerWidth <= 768 && window.innerWidth > 0) {
      this.hideAddText = false;
    }

    this.getAllEmployees();
    this.getAllLeaves();
  }

  createForm(): FormGroup {
    return new FormGroup({
      employeeId: new FormControl(''),
      leave_type: new FormControl(''),
      reason: new FormControl(''),
      from_date: new FormControl(''),
      to_date: new FormControl(''),
      modified_by: new FormControl('')
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

  getAllLeaves() {
    this.leaveService.getAllLeaves().subscribe(leaves => {
      this.leaves = leaves;
    });
  }

  getRemainingLeave(usedLeave: number): number {
    return this.unusedLeave - usedLeave;
  }

  addLeave() {
    this.leaveService.addLeave(this.leaveForm.value).subscribe((msg) => {
      this.alertTitle = 'Leave Recorded';
      this.alertMessage = msg.message;

      document.getElementById('open-modal')?.click();

      this.getAllLeaves();
    });
  }

  showLeaveDetails(leave_type: string, employeeId: any) {
    this.leaveService.getSpecificLeavesByEmployee(leave_type, employeeId).subscribe(leaves => {
      this.leaveDetails = leaves;

      if(!this.leaveDetails.leaveDetails || this.leaveDetails.leaveDetails.length === 0){
        this.noLeaveDetails = true;
      }
      else {
        this.noLeaveDetails = false;
      }
      document.getElementById('open-leave-details-modal')?.click();
    });
  }

  updateSearchKey(event: any) {
    this.searchKey = event.target.value;
  }

  searchleave() {
    if(this.searchKey === "") {
      this.getAllLeaves();
    }
    else {
      this.leaveService.searchLeave(this.searchKey).subscribe((leaves) => {
      
        this.leaves = leaves;
      });
    }
    
  }

}
