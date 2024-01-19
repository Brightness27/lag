import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';

import html2pdf from 'html2pdf.js';
import { EmployeesService } from 'src/app/services/employee-service/employees.service';
import { InventoryService } from 'src/app/services/inventory-services/inventory.service';
import { AdminServicesService } from 'src/app/services/admin-services/admin-services.service';
import { ConstantsService } from 'src/app/services/constants/constants.service';

@Component({
  selector: 'app-print-to-pdf',
  templateUrl: './print-to-pdf.component.html',
  styleUrls: ['./print-to-pdf.component.css'],
  providers: [DatePipe]
})
export class PrintToPdfComponent implements OnInit{

  type: any;
  fileName: string = '';

  activeEmployees: any[] = [];
  inventories: any[] = [];

  tableData: any[] = [];
  filterData: any = {};

  filtered = false;

  token: any;
  admin_id: any;
  employee_id: any;

  constructor(private activatedRoute: ActivatedRoute, private adminService: AdminServicesService , private employeeService: EmployeesService, private inventoryService: InventoryService, private location: Location, private shareData: ConstantsService, private datePipe: DatePipe){
    this.type = this.activatedRoute.snapshot.params['type'];
  }
  
  ngOnInit(): void {
    this.fileName = this.type + '.pdf';

    //get the details of the admin
    this.token = this.adminService.getTokenDetails();

    //set the details of the admin if retrieved
    if(this.token) {
      this.admin_id = this.token.adminId;
      this.adminService.getAdminById(this.admin_id).subscribe(admin => {
        this.employee_id = admin.employee_id;
      });
    }

    if(this.type === 'employees') {
      this.getAllEmployees();
    }
    else if(this.type === 'inventory') {
      this.getAllInventories();
    }

    else if (this.type === 'workflow') {
      this.getWorkflows();
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

  getWorkflows() {
    this.shareData.tableData$.subscribe(data => {
      this.tableData = data;
    });

    this.shareData.filterData$.subscribe(data => {
      this.filterData = {
          ... data,
          date_date: this.transformDate(data.date_date),
          month_date: this.transformMonth(data.month_date),
          range_from: this.transformDate(data.range_from),
          range_to: this.transformDate(data.range_to)
        };

      if(this.filterData.site === 'ALL' && this.filterData.filterType === 'ALL') {
        this.filtered = false;
      }
      else {
        this.filtered = true;
      }

      console.log(this.filtered, this.filterData);
      
    });

    this.downloadPDF();
    this.location.back();
  }

  getTextColor(bgColor: string | null) {
    if(bgColor === 'bg-light')
      return 'text-dark';
    else
      return 'text-white';
  }

  transformDate(date: string): string {
    const transformedDate = this.datePipe.transform(date, 'MMMM d, y');
    return transformedDate ? transformedDate.toUpperCase() : '';
  }

  transformMonth(date: string): string {
    const transformedDate = this.datePipe.transform(date, 'MMMM y');
    return transformedDate ? transformedDate.toUpperCase() : '';
  }


}
