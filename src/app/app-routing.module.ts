import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { HomeComponent } from './components/home/home.component';
import { ContactUsComponent } from './components/contact-us/contact-us.component';
import { AssessmentComponent } from './components/assessment/assessment.component';
import { AdminComponent } from './components/admin/admin.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AdminGaurd } from './guard/admingaurd';
import { ViewAssessmentDetailsComponent } from './components/view-assessment-details/view-assessment-details.component';
import { CartComponent } from './components/cart/cart.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { TestScreenComponent } from './components/test-screen/test-screen.component';
import { ResultScreenComponent } from './components/dashboard/result-screen/result-screen.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'about-us', component: AboutUsComponent },
  { path: 'contact-us', component: ContactUsComponent },
  { path: 'assessment', component: AssessmentComponent },
  { path: 'admin', component: AdminComponent, canActivate: [AdminGaurd] },
  { path: 'navbar', component: NavbarComponent },
  { path: 'cart', component: CartComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'testScreen', component: TestScreenComponent },
  {path: 'resultScreen', component:ResultScreenComponent},
  {
    path: 'view-assessment',
    component: AssessmentComponent
  },
  {
    path: 'view-assessment-details/:id',
    component: ViewAssessmentDetailsComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: false })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
