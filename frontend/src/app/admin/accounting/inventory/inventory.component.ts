import { Component, OnInit } from '@angular/core';
import { AdminServicesService } from 'src/app/services/admin-services/admin-services.service';

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

  token: any;

  constructor(private adminService: AdminServicesService) {}

  ngOnInit(): void {
    this.token = this.adminService.getTokenDetails();
  }

  onToggleSideNav(data: SideNavToggle): void {
    this.screenWidth = data.screenWidth;
    this.isSideNavCollapsed = data.collapsed;
  }
}
