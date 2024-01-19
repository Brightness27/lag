import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminServicesService } from 'src/app/services/admin-services/admin-services.service';
import { ConstantsService } from 'src/app/services/constants/constants.service';

@Component({
  selector: 'app-print-workflow-details',
  templateUrl: './print-workflow-details.component.html',
  styleUrls: ['./print-workflow-details.component.css']
})
export class PrintWorkflowDetailsComponent implements OnInit {

  fileName: string = '';

  workflow: any = {};

  token: any;
  admin_id: any;
  employee_id: any;

  constructor(private activatedRoute: ActivatedRoute, private adminService: AdminServicesService, private shareData: ConstantsService){
    this.fileName = 'WORKFLOW-' + this.activatedRoute.snapshot.params['ctrl_no'] + '.pdf';
  }

  ngOnInit(): void {
    this.token = this.adminService.getTokenDetails();
    if(this.token) {
      this.admin_id = this.token.adminId;
      this.adminService.getAdminById(this.admin_id).subscribe(admin => {
        this.employee_id = admin.employee_id;
      });
    }
    
  }
}
