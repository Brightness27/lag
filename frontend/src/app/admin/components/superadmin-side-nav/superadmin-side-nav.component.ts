import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { navbarData, staffNavbarData, inventoryNavbarData, engineeringNavbarData } from './nav-data';
import { faArrowLeft, faUserCog } from '@fortawesome/free-solid-svg-icons';
import { AdminServicesService } from 'src/app/services/admin-services/admin-services.service';

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-superadmin-side-nav',
  templateUrl: './superadmin-side-nav.component.html',
  styleUrls: ['./superadmin-side-nav.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({opacity: 0}),
        animate('350ms', 
          style({opacity: 1})
        )
      ]),
      transition(':leave', [
        style({opacity: 1}),
        animate('200ms', 
          style({opacity: 0})
        )
      ])
    ])
  ]
})
export class SuperadminSideNavComponent implements OnInit{

  title = "Admin";
  staffTitle = "Employees";
  inventoryTitle = "Inventory";
  engineeringTitle = "Engineering";

  // fullName = '';
  profileIcon = faUserCog;

  @Output() onToggleSideNav: EventEmitter<SideNavToggle> = new EventEmitter;

  @Input() name: string = '';

  collapsed = false;
  closeIcon = faArrowLeft;

  screenWidth = 0;

  navData = navbarData;
  staffNavData = staffNavbarData;
  inventoryNavData = inventoryNavbarData;
  engineeringNavData = engineeringNavbarData;

  @Input() department: String = '';
  
  superadmin = false;
  hr = false;
  accounting = false;
  engineering = false;

  token: any;

  constructor(private adminService: AdminServicesService) {}

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = window.innerWidth;
    this.collapsed = false;
    this.onToggleSideNav.emit({collapsed:this.collapsed, screenWidth: this.screenWidth});
  }

  ngOnInit(): void {
    this.screenWidth = window.innerWidth;
    
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
  
  toggleCollapse(): void {
    this.collapsed = !this.collapsed;
    this.onToggleSideNav.emit({collapsed:this.collapsed, screenWidth: this.screenWidth});
  }

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

}
