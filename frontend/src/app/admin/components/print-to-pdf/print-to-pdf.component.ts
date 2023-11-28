import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import html2pdf from 'html2pdf.js';
import { EmployeesService } from 'src/app/services/employee-service/employees.service';
import { InventoryService } from 'src/app/services/inventory-services/inventory.service';

@Component({
  selector: 'app-print-to-pdf',
  templateUrl: './print-to-pdf.component.html',
  styleUrls: ['./print-to-pdf.component.css']
})
export class PrintToPdfComponent implements OnInit{

  type: any;
  fileName: string = '';

  activeEmployees: any[] = [];
  inventories: any[] = [];

  constructor(private activatedRoute: ActivatedRoute, private employeeService: EmployeesService, private inventoryService: InventoryService, private location: Location){
    this.type = this.activatedRoute.snapshot.params['type'];
  }
  
  ngOnInit(): void {
    this.fileName = this.type + '.pdf';

    if(this.type === 'employees') {
      this.getAllEmployees();
    }
    else if(this.type === 'inventory') {
      this.getAllInventories();
    }
    
    
  }

  downloadPDF() {
    
    const element = document.getElementById(this.type);

    var opt = {
      margin:       0.5,
      filename:     this.fileName,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
    };
    
    html2pdf(element, opt);
  }

  getAllEmployees(): void {
    var counter = 1;
    this.employeeService.getAllEmployees('Active').subscribe((employees) => {
      
        this.activeEmployees = employees.map(employee => {
          return {
            ...employee,
            num: counter++,
            full_name: employee.fname + ' ' + employee.mname + ' ' + employee.lname
          };
        });

        this.downloadPDF();
        this.location.back();
    });

  }

  getAllInventories() {
    var counter = 1;
    this.inventoryService.getAllInventories().subscribe(inventories => {
      this.inventories = inventories.map(inventory => {
        return {
          ...inventory,
          num: counter++,
        };
      });

      this.downloadPDF();
      this.location.back();
    });
  }


}
