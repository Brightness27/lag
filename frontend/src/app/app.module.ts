import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeadNavComponent } from './components/head-nav/head-nav.component';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { ServicesComponent } from './components/services/services.component';
import { LoginComponent } from './admin/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { FooterComponent } from './components/footer/footer.component';
import { AdminHomeComponent } from './admin/admin-pages/admin-home/admin-home.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ServicePageComponent } from './pages/service-page/service-page.component';
import { AboutPageComponent } from './pages/about-page/about-page.component';
import { CarouselModule } from './modules/carousel/carousel.module';
import { AdminNavbarComponent } from './admin/components/admin-navbar/admin-navbar.component';
import { InventoryComponent } from './admin/accounting/inventory/inventory.component';
import { EmployeesComponent } from './admin/hr/employees/employees.component';
import { AddEmployeeComponent } from './admin/hr/add-employee/add-employee.component';
import { EmployeeDetailsComponent } from './admin/hr/employee-details/employee-details.component';
import { SickLeaveComponent } from './admin/hr/sick-leave/sick-leave.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { SuperadminSideNavComponent } from './admin/components/superadmin-side-nav/superadmin-side-nav.component';
import { AdminListComponent } from './admin/admin-pages/admin-list/admin-list.component';
import { AddAdminComponent } from './admin/admin-pages/add-admin/add-admin.component';
import { ProfilePageComponent } from './admin/profile-page/profile-page.component';
import { AdminDetailsComponent } from './admin/admin-pages/admin-details/admin-details.component';
import { AddInventoryComponent } from './admin/accounting/add-inventory/add-inventory.component';
import { InventoryDetailsComponent } from './admin/accounting/inventory-details/inventory-details.component';
import { InventoryProcessComponent } from './admin/accounting/inventory-process/inventory-process.component';
import { PrintToPdfComponent } from './admin/components/print-to-pdf/print-to-pdf.component';
import { FlowOfWorkComponent } from './admin/engineering/flow-of-work/flow-of-work.component';


@NgModule({
  declarations: [
    AppComponent,
    HeadNavComponent,
    HomeComponent,
    AboutComponent,
    MainPageComponent,
    ServicesComponent,
    LoginComponent,
    RegisterComponent,
    FooterComponent,
    AdminHomeComponent,
    ServicePageComponent,
    AboutPageComponent,
    AdminNavbarComponent,
    InventoryComponent,
    EmployeesComponent,
    AddEmployeeComponent,
    EmployeeDetailsComponent,
    SickLeaveComponent,
    NotFoundComponent,
    SuperadminSideNavComponent,
    AdminListComponent,
    AddAdminComponent,
    ProfilePageComponent,
    AdminDetailsComponent,
    AddInventoryComponent,
    InventoryDetailsComponent,
    InventoryProcessComponent,
    PrintToPdfComponent,
    FlowOfWorkComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    CarouselModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
