import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormularioEjecucionComponent } from './componentes/formulario-ejecucion/formulario-ejecucion.component';
import { PaginaEjecucionComponent } from './paginas/pagina-ejecucion/pagina-ejecucion.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AlertasModule } from '../alertas/alertas.module';
import { InputsModule } from '../inputs/inputs.module';
import { TabFormularioEjecucionComponent } from './componentes/tab-formulario-ejecucion/tab-formulario-ejecucion.component';
import { TablaActividadesFormEjecComponent } from './componentes/tabla-actividades-form-ejec/tabla-actividades-form-ejec.component';
import { TablaItemsAdicionalesFormEjecComponent } from './componentes/tabla-items-adicionales-form-ejec/tabla-items-adicionales-form-ejec.component';
import { ActividadFormEjecComponent } from './componentes/actividad-form-ejec/actividad-form-ejec.component';
import { AdicionalFormEjecComponent } from './componentes/adicional-form-ejec/adicional-form-ejec.component';
import { PaginaListadoEjecucionComponent } from './paginas/pagina-listado-ejecucion/pagina-listado-ejecucion.component';
import { PipesModule } from '../pipes/pipes.module';
import { RouterModule } from '@angular/router';
import { ImportarPatiosComponent } from './componentes/importar-patios/importar-patios.component';
import { ImportarEmpresasComponent } from './componentes/importar-empresas/importar-empresas.component';
import { InformacionGeneralModule } from '../informacion-general/informacion-general.module';



@NgModule({
  declarations: [
    FormularioEjecucionComponent,
    PaginaEjecucionComponent,
    TabFormularioEjecucionComponent,
    TablaActividadesFormEjecComponent,
    TablaItemsAdicionalesFormEjecComponent,
    ActividadFormEjecComponent,
    AdicionalFormEjecComponent,
    PaginaListadoEjecucionComponent,
    ImportarPatiosComponent,
    ImportarEmpresasComponent
  ],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    AlertasModule,
    InputsModule,
    InformacionGeneralModule,
    PipesModule,
    RouterModule
  ]
})
export class EjecucionModule { }
