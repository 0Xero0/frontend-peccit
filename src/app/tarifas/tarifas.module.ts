import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginaTarifasComponent } from './paginas/pagina-tarifas/pagina-tarifas.component';
import { TarifasRoutingModule } from './tarifas-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputsModule } from '../inputs/inputs.module';
import { AlertasModule } from '../alertas/alertas.module';



@NgModule({
  declarations: [
    PaginaTarifasComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    InputsModule,
    AlertasModule,
    TarifasRoutingModule
  ],
  exports: [
    PaginaTarifasComponent
  ]
})
export class TarifasModule { }
