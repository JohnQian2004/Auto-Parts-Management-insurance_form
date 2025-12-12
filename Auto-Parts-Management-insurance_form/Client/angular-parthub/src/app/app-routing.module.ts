import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

import { ActivationComponent } from './activation/activation/activation.component';
import { DetailComponent } from './detail/detail.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { InshopComponent } from './inshop/inshop.component';
import { Inshop2Component } from './inshop2/inshop2.component';
import { Inshop3Component } from './inshop3/inshop3.component';
import { IntakeHomeComponent } from './intake-home/intake-home.component';
import { IntakeHome2Component } from './intake-home2/intake-home2.component';
import { IntakeHome3Component } from './intake-home3/intake-home3.component';
import { PasswordComponent } from './password/password.component';
import { ProfileComponent } from './profile/profile.component';
import { RegistrationComponent } from './registration/registration.component';
import { SavedItemComponent } from './saved-item/saved-item.component';


import { AddCustomersComponent } from './add-customers/add-customers.component';
import { AddNewVehicleComponent } from './add-new-vehicle/add-new-vehicle.component';
import { AddUserComponent } from './add-user/add-user.component';
import { ApprovalStatusComponent } from './approval-status/approval-status.component';
import { ArrivalModeComponent } from './arrival-mode/arrival-mode.component';
import { AtuoPartsComponent } from './atuo-parts/atuo-parts.component';
import { CustomersComponent } from './customers/customers.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { Detail2Component } from './detail2/detail2.component';
import { DisclaimerComponent } from './disclaimer/disclaimer.component';
import { EmployeeRolesComponent } from './employee-roles/employee-roles.component';
import { EmployeeViewComponent } from './employee-view/employee-view.component';
import { EmployeeView2Component } from './employee-view2/employee-view2.component';
import { EmployeesComponent } from './employees/employees.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { Home2Component } from './home2/home2.component';
import { InsuranceCompaniesComponent } from './insurance-companies/insurance-companies.component';
import { InventoryComponent } from './inventory/inventory.component';
import { InvoicesComponent } from './invoices/invoices.component';
import { JobRequestTypeComponent } from './job-request-type/job-request-type.component';
import { JobStatusComponent } from './job-status/job-status.component';
import { ListPart2Component } from './list-part2/list-part2.component';
import { MarketPanelComponent } from './market-panel/market-panel.component';
import { PaidInCategoriesComponent } from './paid-in-categories/paid-in-categories.component';
import { ParkingLocationComponent } from './parking-location/parking-location.component';
import { PaymentMethodComponent } from './payment-method/payment-method.component';
import { PaymentStatusComponent } from './payment-status/payment-status.component';
import { PreDefinedJobsComponent } from './pre-defined-jobs/pre-defined-jobs.component';
import { RentalCompaniesComponent } from './rental-companies/rental-companies.component';
import { ServiceTypeComponent } from './service-type/service-type.component';
import { UsersPartsMarketComponent } from './users-parts-market/users-parts-market.component';
import { UsersComponent } from './users/users.component';
import { VehicleStatusComponent } from './vehicle-status/vehicle-status.component';
import { VendorsComponent } from './vendors/vendors.component';

import { PayrollHistoryComponent } from './payroll-history/payroll-history.component';

import { KeyLocationComponent } from './key-location/key-location.component';

import { BannerComponent } from './banner/banner.component';
import { DetailVehicleComponent } from './detail-vehicle/detail-vehicle.component';
import { DetailVehicle2Component } from './detail-vehicle2/detail-vehicle2.component';
import { DetailVehicle3Component } from './detail-vehicle3/detail-vehicle3.component';
import { DocTypeComponent } from './doc-type/doc-type.component';
import { EmailInfoComponent } from './email-info/email-info.component';
import { EmployeeRoutineComponent } from './employee-routine/employee-routine.component';
import { ExpenseTypeComponent } from './expense-type/expense-type.component';
import { ExpenseComponent } from './expense/expense.component';
import { Inshop4Component } from './inshop4/inshop4.component';
import { Inshop5Component } from './inshop5/inshop5.component';
import { ItemTypeComponent } from './item-type/item-type.component';
import { PaymentHistoryComponent } from './payment-history/payment-history.component';
import { RegisterShopComponent } from './register-shop/register-shop.component';
import { RepairMenualComponent } from './repair-menual/repair-menual.component';
import { ShopManagementShopComponent } from './shop-managment-shop/shop-management-shop.component';
import { ShopManagementComponent } from './shop-managment/shop-management.component';
import { UsersPartsMarket2Component } from './users-parts-market2/users-parts-market2.component';
import { UsersPartsMarket3Component } from './users-parts-market3/users-parts-market3.component';
import { WarrantyComponent } from './warranty/warranty.component';

// Insurance components
import { InsuranceManagementComponent } from './insurance-management/insurance-management.component';
import { InsuranceViewingComponent } from './insurance-viewing/insurance-viewing.component';
import { PdfParserComponent } from './pdf-parser/pdf-parser.component';

// Report components
import { Profile2Component } from './profile2/profile2.component';
import { ReportViewingComponent } from './report-viewing/report-viewing.component';
import { ReportViewing2Component } from './report-viewing2/report-viewing2.component';
import { TravelAdmin2Component } from './travel/travel-admin2/travel-admin2.component';

const routes: Routes = [
  // { path: 'home', component: HomeComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'add-new-vehicle', component: AddNewVehicleComponent },
  { path: 'users-parts-market', component: UsersPartsMarketComponent },
  { path: 'users-parts-market2', component: UsersPartsMarket2Component },
  { path: 'users-parts-market3', component: UsersPartsMarket3Component },

  { path: 'shop-management', component: ShopManagementComponent },
  { path: 'shop-management-shop', component: ShopManagementShopComponent },

  { path: 'repair-manual', component: RepairMenualComponent },

  { path: 'market-panel', component: MarketPanelComponent },
  { path: 'auto-parts', component: AtuoPartsComponent },

  { path: 'payment-method', component: PaymentMethodComponent },

  { path: 'approval-status', component: ApprovalStatusComponent },



  { path: 'home', component: IntakeHome2Component },
  { path: 'add-customers', component: AddCustomersComponent },
  { path: 'customers', component: CustomersComponent },
  { path: 'invoices', component: InvoicesComponent },
  { path: 'users', component: UsersComponent },
  { path: 'add-user', component: AddUserComponent },
  { path: 'disclaimers', component: DisclaimerComponent },
  { path: 'warranties', component: WarrantyComponent },



  { path: 'inventory', component: InventoryComponent },
  { path: 'employee-roles', component: EmployeeRolesComponent },
  { path: 'service-types', component: ServiceTypeComponent },
  { path: 'banners', component: BannerComponent },



  { path: 'item-types', component: ItemTypeComponent },
  { path: 'doc-types', component: DocTypeComponent },





  { path: 'feedbacks', component: FeedbackComponent },

  { path: 'emailinfo', component: EmailInfoComponent },

  { path: 'employees', component: EmployeesComponent },
  { path: 'insurance-companies', component: InsuranceCompaniesComponent },
  { path: 'rental-companies', component: RentalCompaniesComponent },
  { path: 'payment-status', component: PaymentStatusComponent },
  { path: 'job-status', component: JobStatusComponent },
  { path: 'job-request-type', component: JobRequestTypeComponent },

  { path: 'paid-in-categories', component: PaidInCategoriesComponent },
  { path: 'pre-defined-jobs', component: PreDefinedJobsComponent },
  { path: 'parking-location', component: ParkingLocationComponent },
  { path: 'key-location', component: KeyLocationComponent },





  { path: 'arrival-mode', component: ArrivalModeComponent },
  { path: 'vehicle-status', component: VehicleStatusComponent },
  { path: 'vendors', component: VendorsComponent },
  // { path: 'home2', component: SearchPartComponent },
  // { path: 'market/:showPostForm', component: HomeComponent },
  { path: 'autoparts', component: HomeComponent },
  { path: 'requestparts', component: Home2Component },
  { path: 'intake', component: IntakeHomeComponent },
  { path: 'intake2', component: IntakeHome2Component },
  { path: 'intake3', component: IntakeHome3Component },

  { path: 'inshop2', component: InshopComponent },
  { path: 'shopdisplay', component: Inshop3Component },
  { path: 'snapshot', component: Inshop4Component },
  { path: 'snapshot2/:userId', component: Inshop5Component },



  { path: 'inshop', component: Inshop2Component },

  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'register2', component: RegisterShopComponent },

  { path: 'registration/:uuid', component: RegistrationComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'password', component: PasswordComponent },

  { path: 'listpart2', component: ListPart2Component },
  { path: 'saveditem', component: SavedItemComponent },

  // { path: 'user', component: BoardUserComponent },
  // { path: 'shop', component: BoardModeratorComponent },

  // {
  //   path: 'shop', component: BoardModeratorComponent, children: [


  //     { path: '', component: ShopHomeComponent },
  //     { path: 'home/:showPostForm', component: HomeComponent },
  //     { path: 'profile', component: ProfileComponent },

  //     { path: 'saveditem', component: SavedItemComponent }

  //   ]
  // },

  // {
  //   path: 'admin', component: BodyShopAdminComponent, children: [


  //     { path: '', component: CompanyEditorComponent },
  //     { path: 'dashboard', component: CompanyDashboardComponent },
  //     { path: 'listpart', component: ListPartComponent },
  //     { path: 'saveditem', component: SavedItemComponent },
  //     { path: 'home/:showPostForm', component: HomeComponent },
  //     { path: 'company', component: CompanyEditorComponent },

  //   ]
  // },

  // {
  //   path: 'admin', component: BoardAdminComponent, children: [
  //     { path: 'home', component: HomeComponent },
  //     { path: 'profile', component: ProfileComponent }
  //   ]
  // },

  // { path: 'admin2', component: BoardAdminComponent2 },
  { path: 'activation/:uuid', component: ActivationComponent },
  { path: 'resetpassword/:uuid', component: ForgetPasswordComponent },


  { path: 'detail/:autopartId', component: DetailComponent },
  { path: 'detail2/:autopartId', component: Detail2Component },
  { path: 'vehicle/:uuid', component: DetailVehicleComponent },
  { path: 'vehicle2/:uuid', component: DetailVehicle2Component },
  { path: 'vehicle3/:uuid', component: DetailVehicle3Component },
  { path: 'operation/:uuid', component: EmployeeRoutineComponent },

  { path: 'expense', component: ExpenseComponent },
  { path: 'expense-types', component: ExpenseTypeComponent },



  { path: 'employee-view/:uuid', component: EmployeeViewComponent },
  { path: 'employee-view2/:uuid', component: EmployeeView2Component },

  { path: 'payroll', component: PayrollHistoryComponent },
  { path: 'paymenthistories', component: PaymentHistoryComponent },

  // Insurance routes
  { path: 'insurance/:companyCode/:publicUuid', component: InsuranceViewingComponent },
  { path: 'insurance-viewing/:companyCode/:publicUuid', component: InsuranceViewingComponent },
  { path: 'insurance-viewing/:companyCode/:publicUuid/:accessKey', component: InsuranceViewingComponent },
  { path: 'insurance-viewing', component: InsuranceViewingComponent },
  { path: 'insurance-management', component: InsuranceManagementComponent },
  { path: 'pdf-parser', component: PdfParserComponent },

  // Report routes
  { path: 'report/:companyCode/:publicUuid', component: ReportViewingComponent },
  { path: 'report-viewing/:companyCode/:publicUuid', component: ReportViewingComponent },
  { path: 'report-viewing/:companyCode/:publicUuid/:accessKey', component: ReportViewingComponent },
  { path: 'report-viewing', component: ReportViewingComponent },
  { path: 'report-viewing2', component: ReportViewing2Component },



  { path: '', redirectTo: 'autoparts', pathMatch: 'full' },

  { path: 'admin2', component: TravelAdmin2Component },
  { path: 'profile2', component: Profile2Component },



];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
