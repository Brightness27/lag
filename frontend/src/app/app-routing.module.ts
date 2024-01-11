import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { LoginComponent } from './admin/login/login.component';
import { AdminHomeComponent } from './admin/admin-pages/admin-home/admin-home.component';
import { ServicePageComponent } from './pages/service-page/service-page.component';
import { AboutPageComponent } from './pages/about-page/about-page.component';
import { InventoryComponent } from './admin/accounting/inventory/inventory.component';
import { EmployeesComponent } from './admin/hr/employees/employees.component';
import { AddEmployeeComponent } from './admin/hr/add-employee/add-employee.component';
import { EmployeeDetailsComponent } from './admin/hr/employee-details/employee-details.component';
import { SickLeaveComponent } from './admin/hr/sick-leave/sick-leave.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { authGuardGuard } from './services/guard/auth-guard.guard';
import { AdminListComponent } from './admin/admin-pages/admin-list/admin-list.component';
import { AddAdminComponent } from './admin/admin-pages/add-admin/add-admin.component';
import { ProfilePageComponent } from './admin/profile-page/profile-page.component';
import { AdminDetailsComponent } from './admin/admin-pages/admin-details/admin-details.component';
import { AddInventoryComponent } from './admin/accounting/add-inventory/add-inventory.component';
import { InventoryDetailsComponent } from './admin/accounting/inventory-details/inventory-details.component';
import { InventoryProcessComponent } from './admin/accounting/inventory-process/inventory-process.component';
import { PrintToPdfComponent } from './admin/components/print-to-pdf/print-to-pdf.component';
import { WorkflowListComponent } from './admin/engineering/workflow-list/workflow-list.component';
import { AddWorkflowComponent } from './admin/engineering/add-workflow/add-workflow.component';
import { WorkflowDetailsComponent } from './admin/engineering/workflow-details/workflow-details.component';
import { UpdateWorkflowComponent } from './admin/engineering/update-workflow/update-workflow.component';
import { ViewImagesComponent } from './admin/components/view-images/view-images.component';
import { PermissionsComponent } from './admin/admin-pages/permissions/permissions.component';

const routes: Routes = [
  {path: '', component: MainPageComponent},
  {path: 'services', component: ServicePageComponent},
  {path: 'services/:name', component: ServicePageComponent},
  {path: 'about-us', component: AboutPageComponent},
  {path: 'admin/login', component: LoginComponent},
  {path: 'admin', redirectTo: '/admin/dashboard', pathMatch: 'full'},
  {path: 'admin/dashboard', canActivate: [authGuardGuard], component: AdminHomeComponent},
  {path: 'admin/list', canActivate: [authGuardGuard], component: AdminListComponent},
  {path: 'admin/list/details/:id', canActivate: [authGuardGuard], component: AdminDetailsComponent},
  {path: 'admin/list/details/permissions/:id', canActivate: [authGuardGuard], component: PermissionsComponent},
  {path: 'admin/profile', canActivate: [authGuardGuard], component: ProfilePageComponent},
  {path: 'admin/add-new-admin', canActivate: [authGuardGuard], component: AddAdminComponent},
  {path: 'admin/employees', redirectTo: '/admin/employees/list', pathMatch: 'full'},
  {path: 'admin/employees/list', canActivate: [authGuardGuard], component: EmployeesComponent},
  {path: 'admin/employees/list/details/:id', canActivate: [authGuardGuard], component: EmployeeDetailsComponent},
  {path: 'admin/employees/add-new-employee', canActivate: [authGuardGuard], component: AddEmployeeComponent},
  {path: 'admin/employees/leave', component: SickLeaveComponent},
  {path: 'admin/inventory', redirectTo: '/admin/inventory/list', pathMatch: 'full'},
  {path: 'admin/inventory/list', canActivate: [authGuardGuard], component: InventoryComponent},
  {path: 'admin/print/:type', canActivate: [authGuardGuard], component: PrintToPdfComponent},
  {path: 'admin/inventory/details/:id', canActivate: [authGuardGuard], component: InventoryDetailsComponent},
  {path: 'admin/inventory/add', canActivate: [authGuardGuard], component: AddInventoryComponent},
  {path: 'admin/inventory/process', canActivate: [authGuardGuard], component: InventoryProcessComponent},
  {path: 'admin/engineering', redirectTo: '/admin/engineering/work-flow/list', pathMatch: 'full'},
  {path: 'admin/engineering/work-flow/list', canActivate: [authGuardGuard], component: WorkflowListComponent},
  {path: 'admin/engineering/work-flow/details/:ctrlno', canActivate: [authGuardGuard], component: WorkflowDetailsComponent},
  {path: 'admin/engineering/work-flow/update/:ctrlno/:step', canActivate: [authGuardGuard], component: UpdateWorkflowComponent},
  {path: 'admin/engineering/work-flow/add', canActivate: [authGuardGuard], component: AddWorkflowComponent},
  {path: 'admin/engineering/work-flow/images/:id', canActivate: [authGuardGuard], component: ViewImagesComponent},
  {path: '**', component: NotFoundComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
function inject(AdminServicesService: any) {
  throw new Error('Function not implemented.');
}

