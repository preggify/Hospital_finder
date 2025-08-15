import { Routes } from '@angular/router';
import { HospitalListComponent } from './components/hospital-list/hospital-list.component';
import { HospitalDetailComponent } from './components/hospital-detail/hospital-detail.component';
import { AddHospitalComponent } from './components/add-hospital/add-hospital.component';

export const routes: Routes = [
  { path: '', component: HospitalListComponent },
  { path: 'hospital/:id', component: HospitalDetailComponent },
  { path: 'add', component: AddHospitalComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' } // Redirect to home for any unknown routes
];
