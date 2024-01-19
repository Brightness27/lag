import { Component, HostListener, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { faPlus, faSearch, faPrint } from '@fortawesome/free-solid-svg-icons';
import { AdminServicesService } from 'src/app/services/admin-services/admin-services.service';
import { ConstantsService } from 'src/app/services/constants/constants.service';
import { WorkflowService } from 'src/app/services/workflow-services/workflow.service';

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-workflow-list',
  templateUrl: './workflow-list.component.html',
  styleUrls: ['./workflow-list.component.css']
})
export class WorkflowListComponent implements OnInit {

  isSideNavCollapsed = false;
  screenWidth = 0;

  workflows: any[] = [];

  sortColumn: string = '';
  sortDirection: string = 'asc';

  department!: any;
  superadmin = false;
  hr = false;
  accounting = false;
  engineering = false;

  addWorkflow = faPlus;
  hideAddText = true;

  search = faSearch;
  searchKey: string = "";

  token: any;
  id: any;
  name: string = '';

  workflow: any = {};
  noWorkflowStatus = true;

  updateStatusForm!: FormGroup;

  alertTitle = '';
  alertMessage = '';

  filterByDate: string = 'ALL';

  date_date: any = '';

  month_date: any = '';

  range_from: any = '';
  range_to: any = '';

  site: string = 'ALL';

  locations: any[] = [];

  printList = faPrint;

  update_status = '';

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if(window.innerWidth > 768) {
      this.hideAddText = true;
    }
    else if(window.innerWidth <= 768 && window.innerWidth > 0) {
      this.hideAddText = false;
    }
  }

  constructor(private adminService: AdminServicesService, private workflowService: WorkflowService, private router: Router, private shareData: ConstantsService) {}

  ngOnInit(): void {
    //get the details of the admin
    this.token = this.adminService.getTokenDetails();

    //set the details of the admin if retrieved
    if(this.token) {
      this.id = this.token.adminId;
      this.adminService.getAdminById(this.id).subscribe(admin => {
        this.department = admin.department;
        this.setActiveDepartment();
        this.name = 'Hello, ' + admin.fname;
      });
    }

    if(window.innerWidth > 768) {
      this.hideAddText = true;
    }
    else if(window.innerWidth <= 768 && window.innerWidth > 0) {
      this.hideAddText = false;
    }

    this.filterWorkflow();

    this.getLocations();
    this.updateStatusForm = this.createForm();
  }

  createForm(): FormGroup {
    return new FormGroup({
      action_date: new FormControl(''),
      actions_taken: new FormControl(''),
      customers_feedback: new FormControl(''),
      action_taken_by	: new FormControl('')
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

  updateSearchKey(event: any) {
    this.searchKey = event.target.value;

    if(this.searchKey === '') {
      this.getAllWorkflows();
    }
  }

  searchItem() {
    var counter = 1;
    if(this.searchKey === "") {
      this.filterWorkflow();
    }
    else {
      this.workflowService.searchWorkflows(this.searchKey).subscribe(workflows => {
      
        this.workflows = workflows.map(workflow => {
          return {
            ...workflow,
            client_name: `${workflow.client_fname} ${workflow.client_mname} ${workflow.client_lname}`,
            link: '/admin/engineering/work-flow/details/' + workflow.ctrl_no,
            statusLink: '/admin/engineering/work-flow/status-updates/' + workflow.ctrl_no,
            num: counter++,
            bg: this.getBackgroundColor(workflow.tracker_status),
            status: this.getStatus(workflow.tracker_status)
          };
        });
      });
    }
  }

  getLocations() {
    this.workflowService.getAllLocations().subscribe(locations => {
      this.locations = locations;
    });
  }

  getAllWorkflows() {
    var counter = 1;
    this.workflowService.getAllWorkflows().subscribe(workflows => {
      this.workflows = workflows.map(workflow => {
        return {
          ...workflow,
          client_name: `${workflow.client_fname} ${workflow.client_mname} ${workflow.client_lname}`,
          link: '/admin/engineering/work-flow/details/' + workflow.ctrl_no,
          statusLink: '/admin/engineering/work-flow/status-updates/' + workflow.ctrl_no,
          num: counter++,
          bg: this.getBackgroundColor(workflow.tracker_status),
          status: this.getStatus(workflow.tracker_status)
        };
      });
    });
  }

  getStatus(trackerStatus: string | null): string {
    let status = '';

    if(!trackerStatus) {
      status = 'ON PROCESS';
    }
    else {
      status = trackerStatus!;
    }
    return status;
  }

  getBackgroundColor(trackerStatus: string | null): string {
    switch (trackerStatus) {
      case 'ENERGIZED':
        return 'bg-energized';

      case 'WITH CONTRACT':
        return 'bg-primary';

      case 'FOR CONTRACT FINALIZE':
        return 'bg-primary';

      case 'CANCELLED':
        return 'bg-danger';

      case 'AWAITING CUSTOMER COMPLIANCE / RETURN ORDER':
        return 'bg-success';

      default:
        return 'bg-light';
    }
  }

  changeFilterType(event: any) {
    const type = event.target.value;
    this.filterByDate = type;

    if (this.filterByDate === 'ALL') {
      this.filterWorkflow();
    }
  }

  // Function to update sorting parameters
  updateSort(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.sortWorkflows();
  }

  // Function to sort workflows based on the selected column
  sortWorkflows() {
    // Sort the workflows array based on the selected column and direction
    this.workflows.sort((a, b) => {
      const valueA = a[this.sortColumn];
      const valueB = b[this.sortColumn];

      // Check if the column is 'date_received'
      if (this.sortColumn === 'date_received') {
        const dateA = new Date(valueA).getTime();
        const dateB = new Date(valueB).getTime();

        return this.sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
      }

      // Handle sorting for different data types (you may need to enhance this based on your data)
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return this.sortDirection === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
      } else {
        return this.sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
      }
    });
  }

  getTextColor(bgColor: string | null) {
    if(bgColor === 'bg-light')
      return 'text-dark';
    else
      return 'text-white';
  }

  updateWorkflowId(id: any, status: any) {
    this.workflowService.getWorkflowStatus(id).subscribe(workflow => {
      this.workflow = workflow;

      if(!this.workflow.status_updates || this.workflow.status_updates.length === 0){
        this.noWorkflowStatus = true;
      }
      else {
        this.noWorkflowStatus = false;
      }

      this.update_status = status;

    });
  }

  addUpdate() {
    const workflow_id = this.workflow.id;
    this.workflowService.addWorkflowstatus(workflow_id, this.updateStatusForm.value).subscribe((msg) => {
      this.alertTitle = 'Leave Record';
      this.alertMessage = msg.message;

      this.updateStatusForm.reset;
      this.workflow = {};

      this.workflowService.getWorkflowStatus(workflow_id).subscribe(workflow => {
        this.workflow = workflow;
  
        if(!this.workflow.status_updates || this.workflow.status_updates.length === 0){
          this.noWorkflowStatus = true;
        }
        else {
          this.noWorkflowStatus = false;
        }
  
      });

      document.getElementById('open-modal')?.click();
    });
  }

  filterWorkflow() {
    var counter = 1;

    switch (this.filterByDate) {
      case 'BY DATE':
        counter = 1;
        this.workflowService.filterWorkflowByDay(this.date_date, this.site).subscribe(workflows => {
          this.workflows = workflows.map(workflow => {
            return {
              ...workflow,
              client_name: `${workflow.client_fname} ${workflow.client_mname} ${workflow.client_lname}`,
              link: '/admin/engineering/work-flow/details/' + workflow.ctrl_no,
              statusLink: '/admin/engineering/work-flow/status-updates/' + workflow.ctrl_no,
              num: counter++,
              bg: this.getBackgroundColor(workflow.tracker_status),
              status: this.getStatus(workflow.tracker_status)
            };
          });
        });

        break;
      
      case 'BY MONTH':
        counter = 1;
        this.workflowService.filterWorkflowByMonth(this.month_date, this.site).subscribe(workflows => {
          this.workflows = workflows.map(workflow => {
            return {
              ...workflow,
              client_name: `${workflow.client_fname} ${workflow.client_mname} ${workflow.client_lname}`,
              link: '/admin/engineering/work-flow/details/' + workflow.ctrl_no,
              statusLink: '/admin/engineering/work-flow/status-updates/' + workflow.ctrl_no,
              num: counter++,
              bg: this.getBackgroundColor(workflow.tracker_status),
              status: this.getStatus(workflow.tracker_status)
            };
          });
        });

        break;

      case 'BY RANGE':
        counter = 1;
        this.workflowService.filterWorkflowByRange(this.range_from, this.range_to, this.site).subscribe(workflows => {
          this.workflows = workflows.map(workflow => {
            return {
              ...workflow,
              client_name: `${workflow.client_fname} ${workflow.client_mname} ${workflow.client_lname}`,
              link: '/admin/engineering/work-flow/details/' + workflow.ctrl_no,
              statusLink: '/admin/engineering/work-flow/status-updates/' + workflow.ctrl_no,
              num: counter++,
              bg: this.getBackgroundColor(workflow.tracker_status),
              status: this.getStatus(workflow.tracker_status)
            };
          });
        });

        break;

        default:

          if(this.site === 'ALL') {
            this.getAllWorkflows();
          }
          else {
            this.workflowService.filterWorkflowBySite(this.site).subscribe(workflows => {
              this.workflows = workflows.map(workflow => {
                return {
                  ...workflow,
                  client_name: `${workflow.client_fname} ${workflow.client_mname} ${workflow.client_lname}`,
                  link: '/admin/engineering/work-flow/details/' + workflow.ctrl_no,
                  statusLink: '/admin/engineering/work-flow/status-updates/' + workflow.ctrl_no,
                  num: counter++,
                  bg: this.getBackgroundColor(workflow.tracker_status),
                  status: this.getStatus(workflow.tracker_status)
                };
              });
            });
          }
          
          break;
    }
  }

  printPDF() {

    let siteFilter = '';

    if (this.site === 'OFFICE') {
      siteFilter = 'WALK IN';
    }
    else {
      siteFilter = this.site;
    }

    const filterData = {
      site: siteFilter,
      filterType: this.filterByDate,
      date_date: this.date_date,
      month_date: this.month_date,
      range_from: this.range_from,
      range_to: this.range_to
    };

    this.shareData.setTableData(this.workflows);
    this.shareData.setFilterData(filterData);
    this.router.navigate(['/admin/print/workflow']);
  }
}
