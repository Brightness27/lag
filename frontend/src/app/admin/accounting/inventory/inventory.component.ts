import { Component, HostListener, OnInit } from '@angular/core';
import { AdminServicesService } from 'src/app/services/admin-services/admin-services.service';
import { InventoryService } from 'src/app/services/inventory-services/inventory.service';

import { faPlus, faSearch, faPrint } from '@fortawesome/free-solid-svg-icons';

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit {

  isSideNavCollapsed = false;
  screenWidth = 0;

  inventories: any[] = [];

  department!: any;

  name: string =  '';

  addInventory = faPlus;
  printList = faPrint;

  hideAddText = true;

  search = faSearch;
  searchKey: string = "";

  superadmin = false;
  hr = false;
  accounting = false;
  engineering = false;

  token: any;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if(window.innerWidth > 768) {
      this.hideAddText = true;
    }
    else if(window.innerWidth <= 768 && window.innerWidth > 0) {
      this.hideAddText = false;
    }
  }

  constructor(private adminService: AdminServicesService, private inventoryService: InventoryService) {}

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

    this.getAllInventories();
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

  getAllInventories() {
    this.inventoryService.getAllInventories().subscribe(inventories => {
      this.inventories = inventories.map(inventory => {
        return {
          ...inventory,
          link: '/admin/inventory/details/' + inventory.item_code,
          bg: this.getBgColor(inventory.quantity)
        };
      });
    });
  }

  getBgColor(remaining_quantity: any) {

    let color = '';
    if(remaining_quantity === '0') {
      color = 'bg-danger';
    }
    else {
      color = '';
    }

    return color;
  }

  getTextColor(bgColor: string | null) {
    if(bgColor === 'bg-danger')
      return 'text-white';
    else
      return 'text-dark';
  }

  updateSearchKey(event: any) {
    this.searchKey = event.target.value;
  }

  searchItem() {
    if(this.searchKey === "") {
      this.getAllInventories();
    }
    else {
      this.inventoryService.searchInventories(this.searchKey).subscribe((inventories) => {
      
        this.inventories = inventories;
      });
    }
  }
}
