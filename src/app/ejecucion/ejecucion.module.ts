import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormularioEjecucionComponent } from './componentes/formulario-ejecucion/formulario-ejecucion.component';
import { PaginaEjecucionComponent } from './paginas/pagina-ejecucion/pagina-ejecucion.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AlertasModule } from '../alertas/alertas.module';
import { InputsModule } from '../inputs/inputs.module';
import { TabFormularioEjecucionComponent } from './componentes/tab-formulario-ejecucion/tab-formulario-ejecucion.component';



@NgModule({
  declarations: [
    FormularioEjecucionComponent,
    PaginaEjecucionComponent,
    TabFormularioEjecucionComponent
  ],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    AlertasModule,
    InputsModule
  ]
})
export class EjecucionModule { }
