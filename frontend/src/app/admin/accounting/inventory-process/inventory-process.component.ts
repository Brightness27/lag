import { Component, OnInit } from '@angular/core';
import { AdminServicesService } from 'src/app/services/admin-services/admin-services.service';
import { InventoryService } from 'src/app/services/inventory-services/inventory.service';

import { faSearch } from '@fortawesome/free-solid-svg-icons';

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-inventory-process',
  templateUrl: './inventory-process.component.html',
  styleUrls: ['./inventory-process.component.css']
})
export class InventoryProcessComponent implements OnInit {
  isSideNavCollapsed = false;
  screenWidth = 0;

  inventories: any[] = [];
  inventory: any = {};

  department!: any;

  name: string =  '';

  search = faSearch;
  searchKey: string = "";

  superadmin = false;
  hr = false;
  accounting = false;
  engineering = false;

  token: any;

  getItem = 0;
  details = '';
  addStocks = 0;
  purchaseDate = '';

  alertTitle = '';
  alertMessage = '';

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

  process(inventory: any) {
    this.inventory = inventory;
    this.getItem = inventory.quantity;
    
  }

  getAllInventories() {
    this.inventoryService.getAllInventories().subscribe(inventories => {
      this.inventories = inventories;
      this.inventory = inventories[0];
    });
  }

  updateSearchKey(event: any) {
    this.searchKey = event.target.value;
  }

  updateAddStocks(event: any) {
    this.addStocks = event.target.value;
  }

  updatePurchaseDate(event: any) {
    this.purchaseDate = event.target.value;
  }

  updateGetItem(event: any) {
    this.getItem = event.target.value;
  }

  updateDetails(event: any) {
    this.details = event.target.value;
  }

  addStockCounts() {
    const processDetails = {
      stockCount: this.addStocks,
      last_purchase_date: this.purchaseDate,
      details: "Refreshing Supplies"
    };
    
    this.inventoryService.processInventories(processDetails, "IN", this.inventory.item_code).subscribe(msg => {
      this.alertTitle = 'Stocks Updated';
      this.alertMessage = msg.message;

      document.getElementById('open-modal')?.click();
      this.addStocks = 0;
      this.purchaseDate = '';
      this.getAllInventories();
    });
  }

  getItemCounts() {
    const processDetails = {
      stockCount: this.getItem,
      details: this.details
    };

    this.inventoryService.processInventories(processDetails, "OUT", this.inventory.item_code).subscribe(msg => {
      this.alertTitle = 'Stocks Updated';
      this.alertMessage = msg.message;

      document.getElementById('open-modal')?.click();
      this.getItem = 0;
      this.details = '';
      this.getAllInventories();
    });
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
