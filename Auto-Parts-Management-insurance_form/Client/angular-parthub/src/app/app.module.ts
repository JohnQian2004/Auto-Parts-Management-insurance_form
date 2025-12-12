import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BoardAdminComponent } from './board-admin/board-admin.component';
import { BoardAdminComponent2 } from './board-admin2/board-admin2.component';
import { BoardModeratorComponent } from './board-moderator/board-moderator.component';
import { BoardUserComponent } from './board-user/board-user.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { RegisterComponent } from './register/register.component';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { NestedConfirmationService } from '../app/_services/nested-confirmation.service';
import { ScrollService } from '../app/_services/scroll.service';
import { httpInterceptorProviders } from './_helpers/http.interceptor';
import { ActivationComponent } from './activation/activation/activation.component';
import { BodyShopAdminComponent } from './body-shop-admin/body-shop-admin.component';
import { CompanyEditorComponent } from './company-editor/company-editor.component';
import { DetailComponent } from './detail/detail.component';
import { InshopComponent } from './inshop/inshop.component';
import { Inshop2Component } from './inshop2/inshop2.component';
import { Inshop3Component } from './inshop3/inshop3.component';
import { IntakeHomeComponent } from './intake-home/intake-home.component';
import { IntakeHome2Component } from './intake-home2/intake-home2.component';
import { IntakeHome3Component } from './intake-home3/intake-home3.component';
import { ListPartComponent } from './list-part/list-part.component';
import { NestedConfirmationTestComponent } from './nested-confirmation-test/nested-confirmation-test.component';
import { PasswordComponent } from './password/password.component';
import { RegistrationComponent } from './registration/registration.component';
import { SavedItemComponent } from './saved-item/saved-item.component';
import { SearchPartComponent } from './search-part/search-part.component';
import { ShopHomeComponent } from './shop-home/shop-home.component';

import { FullCalendarModule } from '@fullcalendar/angular';
import { ColorPickerModule } from 'ngx-color-picker';
import { CompanyDashboardComponent } from './company-dashboard/company-dashboard.component';
//import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { NgChartsModule } from 'ng2-charts';
import { AddCustomersComponent } from './add-customers/add-customers.component';
import { AddNewVehicleComponent } from './add-new-vehicle/add-new-vehicle.component';
import { AddUserComponent } from './add-user/add-user.component';
import { ArrivalModeComponent } from './arrival-mode/arrival-mode.component';
import { CustomersComponent } from './customers/customers.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DisclaimerComponent } from './disclaimer/disclaimer.component';
import { EmployeeRolesComponent } from './employee-roles/employee-roles.component';
import { EmployeesComponent } from './employees/employees.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { InsuranceCompaniesComponent } from './insurance-companies/insurance-companies.component';
import { InventoryComponent } from './inventory/inventory.component';
import { InvoicesComponent } from './invoices/invoices.component';
import { JobRequestTypeComponent } from './job-request-type/job-request-type.component';
import { JobStatusComponent } from './job-status/job-status.component';
import { ListPart2Component } from './list-part2/list-part2.component';
import { MarketPanelComponent } from './market-panel/market-panel.component';
import { PaidInCategoriesComponent } from './paid-in-categories/paid-in-categories.component';
import { ParkingLocationComponent } from './parking-location/parking-location.component';
import { PaymentStatusComponent } from './payment-status/payment-status.component';
import { PreDefinedJobsComponent } from './pre-defined-jobs/pre-defined-jobs.component';
import { RentalCompaniesComponent } from './rental-companies/rental-companies.component';
import { UsersComponent } from './users/users.component';
import { VehicleStatusComponent } from './vehicle-status/vehicle-status.component';
import { VendorsComponent } from './vendors/vendors.component';

import { AtuoPartsComponent } from './atuo-parts/atuo-parts.component';

import { NgxPaginationModule } from 'ngx-pagination';
import { NoSpaceDirective } from '../app/_helpers/change-text.directive';
import { ApprovalStatusComponent } from './approval-status/approval-status.component';
import { Detail2Component } from './detail2/detail2.component';
import { EmployeeViewComponent } from './employee-view/employee-view.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { Home2Component } from './home2/home2.component';
import { PaymentMethodComponent } from './payment-method/payment-method.component';
import { ServiceTypeComponent } from './service-type/service-type.component';
import { UsersPartsMarketComponent } from './users-parts-market/users-parts-market.component';

import { ShortNamePipe } from './_helpers/short-name.pipe';
import { TrimPipe } from './_helpers/trim.pipe';
import { QRCodeModule } from './angularx-qrcode/angularx-qrcode.module';
import { DetailVehicleComponent } from './detail-vehicle/detail-vehicle.component';
import { DocTypeComponent } from './doc-type/doc-type.component';
import { ItemTypeComponent } from './item-type/item-type.component';
import { KeyLocationComponent } from './key-location/key-location.component';
import { PayrollHistoryComponent } from './payroll-history/payroll-history.component';
import { WarrantyComponent } from './warranty/warranty.component';

import { BannerComponent } from './banner/banner.component';
import { BottomMenuComponent } from './bottom-menu/bottom-menu.component';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { DetailVehicle2Component } from './detail-vehicle2/detail-vehicle2.component';
import { DetailVehicle3Component } from './detail-vehicle3/detail-vehicle3.component';
import { EmailInfoComponent } from './email-info/email-info.component';
import { EmployeeRoutineComponent } from './employee-routine/employee-routine.component';
import { EmployeeView2Component } from './employee-view2/employee-view2.component';
import { ExpenseTypeComponent } from './expense-type/expense-type.component';
import { ExpenseComponent } from './expense/expense.component';
import { Inshop4Component } from './inshop4/inshop4.component';
import { Inshop5Component } from './inshop5/inshop5.component';
import { PaymentHistoryComponent } from './payment-history/payment-history.component';
import { RegisterShopComponent } from './register-shop/register-shop.component';
import { RepairMenualComponent } from './repair-menual/repair-menual.component';
import { ShopManagementShopComponent } from './shop-managment-shop/shop-management-shop.component';
import { ShopManagementComponent } from './shop-managment/shop-management.component';
import { TimelineComponent } from './timeline/timeline.component';
import { UsersPartsMarket2Component } from './users-parts-market2/users-parts-market2.component';
import { UsersPartsMarket3Component } from './users-parts-market3/users-parts-market3.component';

// Insurance components
import { InsuranceManagementComponent } from './insurance-management/insurance-management.component';
import { InsuranceViewingComponent } from './insurance-viewing/insurance-viewing.component';
import { PdfParserComponent } from './pdf-parser/pdf-parser.component';

// Report components
import { ReportViewingComponent } from './report-viewing/report-viewing.component';
import { ReportViewing2Component } from './report-viewing2/report-viewing2.component';
// Vehicle detail editor component
import { VehicleDetailEditorComponent } from './vehicle-detail-editor/vehicle-detail-editor.component';
// Vehicle detail test component
import { AnalyticsDashboardComponent } from './components/analytics-dashboard/analytics-dashboard.component';
import { StripePaymentFormComponent } from './components/stripe-payment-form/stripe-payment-form.component';
import { Profile2Component } from './profile2/profile2.component';
import { TravelAdminSubscriptionPlanReportComponent } from './travel/travel-admin-subscription-plan-report/travel-admin-subscription-plan-report.component';
import { TravelAdminSubscriptionPlanComponent } from './travel/travel-admin-subscription-plan/travel-admin-subscription-plan.component';
import { TravelAdmin2Component } from './travel/travel-admin2/travel-admin2.component';
import { TravelCategoryComponent } from './travel/travel-category/travel-category.component';
import { TravelTripDetail2Component } from './travel/travel-trip-detail2/travel-trip-detail2.component';
import { TravelTripEditor2Component } from './travel/travel-trip-editor2/travel-trip-editor2.component';
import { TravelTripComponent } from './travel/travel-trip/travel-trip.component';
import { VehicleDetailTestComponent } from './vehicle-detail-test/vehicle-detail-test.component';


@NgModule({
  declarations: [
    ShortNamePipe,
    TrimPipe,
    EmployeeRoutineComponent,
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    Home2Component,
    ProfileComponent,
    BoardAdminComponent,
    BoardAdminComponent2,
    BoardModeratorComponent,
    BoardUserComponent,
    ActivationComponent,
    NestedConfirmationTestComponent,
    DetailComponent,
    Detail2Component,
    ListPartComponent,
    ListPart2Component,
    ShopHomeComponent,
    SavedItemComponent,
    SearchPartComponent,
    IntakeHomeComponent,
    IntakeHome2Component,
    IntakeHome3Component,
    BodyShopAdminComponent,
    CompanyEditorComponent,
    PasswordComponent,
    RegistrationComponent,
    InshopComponent,
    Inshop2Component,
    Inshop3Component,
    Inshop4Component,
    Inshop5Component,
    CompanyDashboardComponent,
    ForgetPasswordComponent,
    AddNewVehicleComponent,
    CustomersComponent,
    AddCustomersComponent,
    InvoicesComponent,
    UsersComponent,
    AddUserComponent,
    DisclaimerComponent,
    InventoryComponent,
    EmployeeRolesComponent,
    EmployeesComponent,
    InsuranceCompaniesComponent,
    RentalCompaniesComponent,
    PaymentStatusComponent,
    JobStatusComponent,
    PaidInCategoriesComponent,
    PreDefinedJobsComponent,
    ParkingLocationComponent,
    ArrivalModeComponent,
    VehicleStatusComponent,
    VendorsComponent,
    DashboardComponent,
    JobRequestTypeComponent,
    MarketPanelComponent,
    UsersPartsMarketComponent,
    UsersPartsMarket2Component,
    UsersPartsMarket3Component,
    AtuoPartsComponent,
    PaymentMethodComponent,
    ApprovalStatusComponent,
    ServiceTypeComponent,
    BannerComponent,
    NoSpaceDirective,
    FeedbackComponent,
    EmployeeViewComponent,
    PayrollHistoryComponent,
    KeyLocationComponent,
    WarrantyComponent,
    DetailVehicleComponent,
    ItemTypeComponent,
    DocTypeComponent,
    ConfirmationDialogComponent,
    BottomMenuComponent,
    EmployeeView2Component,
    DetailVehicle2Component,
    TimelineComponent,
    DetailVehicle3Component,
    EmailInfoComponent,
    ExpenseComponent,
    ExpenseTypeComponent,
    RegisterShopComponent,
    ShopManagementComponent,
    ShopManagementShopComponent,
    PaymentHistoryComponent,
    RepairMenualComponent,

    // Insurance components
    InsuranceViewingComponent,
    InsuranceManagementComponent,
    PdfParserComponent,

    // Report components
    ReportViewingComponent,
    ReportViewing2Component,
    VehicleDetailEditorComponent,
    VehicleDetailTestComponent,

    // Travel components
    TravelTripComponent,
    TravelCategoryComponent,
    TravelTripEditor2Component,
    TravelTripDetail2Component,
    TravelAdminSubscriptionPlanComponent,
    TravelAdminSubscriptionPlanReportComponent,
    TravelAdmin2Component,
    StripePaymentFormComponent,
    AnalyticsDashboardComponent,

    Profile2Component,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    DragDropModule,
    FullCalendarModule,
    ColorPickerModule,
    // CanvasJSAngularChartsModule
    NgChartsModule,
    AngularEditorModule,
    NgxPaginationModule,
    QRCodeModule
  ],
  providers: [httpInterceptorProviders, ScrollService, NestedConfirmationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
