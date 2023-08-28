import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputBusquedaComponent } from './componentes/input-busqueda/input-busqueda.component';
import { InputArchivoComponent } from './componentes/input-archivo/input-archivo.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    InputBusquedaComponent,
    InputArchivoComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    InputBusquedaComponent,
    InputArchivoComponent
  ]
})
export class InputsModule { }
