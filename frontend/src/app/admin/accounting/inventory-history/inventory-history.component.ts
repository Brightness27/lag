import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AdminServicesService } from 'src/app/services/admin-services/admin-services.service';
import { InventoryService } from 'src/app/services/inventory-services/inventory.service';

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-inventory-history',
  templateUrl: './inventory-history.component.html',
  styleUrls: ['./inventory-history.component.css'],
  providers: [DatePipe]
})
export class InventoryHistoryComponent implements OnInit {
  
  isSideNavCollapsed = false;
  screenWidth = 0;

  records: any[] = [];

  department!: any;

  name: string =  '';

  superadmin = false;
  hr = false;
  accounting = false;
  engineering = false;

  token: any;

  date: any = '';

  constructor(private adminService: AdminServicesService, private inventoryService: InventoryService, private datePipe: DatePipe) {
    this.date = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  }

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

    this.getHistory();
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

  getHistory() {
    this.inventoryService.getHistory(this.date).subscribe(records => {
      this.records = records;
      
    });
  }
}
