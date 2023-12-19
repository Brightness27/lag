import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { AdminServicesService } from 'src/app/services/admin-services/admin-services.service';
import { InventoryService } from 'src/app/services/inventory-services/inventory.service';

import JsBarcode from 'jsbarcode';

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-inventory-details',
  templateUrl: './inventory-details.component.html',
  styleUrls: ['./inventory-details.component.css']
})
export class InventoryDetailsComponent {
  isSideNavCollapsed = false;
  screenWidth = 0;

  id: any;

  item: any;
  itemName: string = '';

  disabled: boolean = true;

  editForm!: FormGroup;
  tempDetails!: FormGroup;

  department!: any;

  superadmin = false;
  hr = false;
  accounting = false;
  engineering = false;

  token: any;

  name: string =  '';

  newCategory = false;
  newCategoryname = '';

  categories: any[] = [];

  adminName: string = '';

  alertTitle: string = '';
  alertMessage: string = '';

  constructor(private activatedRoute: ActivatedRoute, private adminService: AdminServicesService, private inventoryService: InventoryService){
    this.id = this.activatedRoute.snapshot.params['id'];
  }

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

    this.editForm =  this.createForm();

    this.tempDetails =  this.createTempForm();

    this.getAllCategories();
    this.getInventoryItem();
  }

  createForm(): FormGroup {
    return new FormGroup({
      name: new FormControl({ value: '', disabled: true }),
      category: new FormControl({ value: '', disabled: true }),
      stock: new FormControl({ value: '', disabled: true }),
      last_stock_date: new FormControl({ value: '', disabled: true })
    });
  }

  createTempForm(): FormGroup {
    return new FormGroup({
      name: new FormControl(''),
      category: new FormControl(''),
      stock: new FormControl(''),
      last_stock_date: new FormControl('')
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

  categoryChanged() {
    const category = this.editForm.get('category')?.value;

    if(category === 'other') {
      this.newCategory = true;
    }
    else {
      this.newCategory = false;
    }
  }

  getAllCategories(): void {
    this.inventoryService.getAllCategories().subscribe((categories) => {
      
      this.categories = categories

    });
  }

  getInventoryItem(): void {
    this.inventoryService.getItemByCode(this.id).subscribe(item => {
      this.item = item;

      this.itemName = item.name;

      this.editForm.patchValue({
        name: this.item.name,
        category: this.item.category_name,
        stock: this.item.quantity,
        last_stock_date: this.item.last_stock_date
      });
    });
  }

  updateCategoryName(event: any) {
    this.newCategoryname = event.target.value;
  }

  update() {
    this.tempDetails.patchValue(this.editForm.value);
    
    this.editForm.get('name')?.enable();
    this.editForm.get('category')?.enable();
    
    this.disabled = !this.disabled;
  }

  updateDetails() {
    if(this.newCategory) {
      this.editForm.patchValue(
        {
          category: this.newCategoryname
        }
      )
    }
    
    this.inventoryService.updateInventory(this.editForm.value, this.id).subscribe((msg) => {
      this.alertTitle = 'Update Item';
      this.alertMessage = msg.message;

      document.getElementById('open-modal')?.click();
    });
    this.editForm.disable();
    this.disabled = true;

    this.getInventoryItem();
  }

  cancelUpdate() {
    this.editForm.patchValue(this.tempDetails.value);
    this.editForm.disable();
    this.disabled = true;
  }

  generateNewBarcode(){
    const barcodeCanvas = document.createElement('canvas');

    JsBarcode(barcodeCanvas, this.id, {
      format: 'CODE128',
      displayValue: true,
      background: 'white',
      lineColor: 'black'
    });

    const barcode_name = this.itemName + '.png';

    // Get the base64-encoded data URL of the canvas image
    const dataURL = barcodeCanvas.toDataURL('image/png').replace("image/png", "image/octet-stream");

    // Create a link element for downloading the image
    const link = document.createElement('a');
    
    link.download = barcode_name;
    link.href = dataURL;

    // Append the link element to the document body and click it
    document.body.appendChild(link);
    link.click();

    // Remove the link element from the document body
    document.body.removeChild(link);

  }
}
