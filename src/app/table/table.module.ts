import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableRoutingModule } from './table-routing.module';
import { TablePageComponent } from './table-page/table-page.component';

@NgModule({
  declarations: [
  
    TablePageComponent
  ],
  imports: [
    CommonModule,
    TableRoutingModule
  ]
})
export class TableModule { }
