import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'landing', loadChildren: () => import('./landing/landing.module').then(m => m.LandingModule) },
   { path: 'table', loadChildren: () => import('./table/table.module').then(m => m.TableModule) },
   { path: '', redirectTo: 'landing', pathMatch: 'full' },
   { path: '**', redirectTo: 'landing', pathMatch: 'full' }
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
