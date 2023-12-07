import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AdminServicesService } from 'src/app/services/admin-services/admin-services.service';
import { InventoryService } from 'src/app/services/inventory-services/inventory.service';

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-add-inventory',
  templateUrl: './add-inventory.component.html',
  styleUrls: ['./add-inventory.component.css']
})
export class AddInventoryComponent {
  isSideNavCollapsed = false;
  screenWidth = 0;

  categories: any[] = [];

  department!: any;
  superadmin = false;
  hr = false;
  accounting = false;
  engineering = false;

  addForm!: FormGroup;

  token: any;

  name: string = '';
  newCategory = false;

  newCategoryname = '';

  alertTitle: string = '';
  alertMessage: string = '';

  constructor(private adminService: AdminServicesService, private inventoryService: InventoryService) {}

  ngOnInit(): void {
    //initalize the formGroup to bind the form element
    this.addForm = this.createFormGroup();

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

    this.getAllCategories();
  }

  //create formGroup
  createFormGroup(): FormGroup {
    return new FormGroup({
      name: new FormControl(''),
      category: new FormControl(''),
      quantity: new FormControl(''),
      unit: new FormControl(''),
      last_purchase_date: new FormControl('')
    });
  }

  //check the department of admin
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

  getAllCategories(): void {
    this.inventoryService.getAllCategories().subscribe((categories) => {
      
      this.categories = categories

    });
  }

  categoryChanged() {
    const category = this.addForm.get('category')?.value;

    if(category === 'other') {
      this.newCategory = true;
    }
    else {
      this.newCategory = false;
    }
  }

  updateCategoryName(event: any) {
    this.newCategoryname = event.target.value;
  }


  //send the form to the backend to add the new admin to the database
  submit() {  
    if(this.newCategory) {
      this.addForm.patchValue(
        {
          category: this.newCategoryname
        }
      )
    }

    this.inventoryService.addInventory(this.addForm.value).subscribe((msg) => {
      this.alertTitle = 'Add Admin';
      this.alertMessage = msg.message;

      document.getElementById('open-modal')?.click();

      this.addForm.reset();
      this.newCategoryname = '';
      this.newCategory = false;
      this.getAllCategories();
    });
  }
}
