import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginaTarifasComponent } from './paginas/pagina-tarifas/pagina-tarifas.component';
import { TarifasRoutingModule } from './tarifas-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputsModule } from '../inputs/inputs.module';
import { AlertasModule } from '../alertas/alertas.module';
import { TarifasComponent } from './componentes/tarifas/tarifas.component';
import { PaginaVisualizarTarifasComponent } from './paginas/pagina-visualizar-tarifas/pagina-visualizar-tarifas.component';



@NgModule({
  declarations: [
    PaginaTarifasComponent,
    TarifasComponent,
    PaginaVisualizarTarifasComponent
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
