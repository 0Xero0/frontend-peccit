import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InformacionGeneralRoutingModule } from './informacion-general-routing.module';
import { ClasificacionInformacionGeneralComponent } from './componentes/clasificacion-informacion-general/clasificacion-informacion-general.component';
import { AlertasModule } from '../alertas/alertas.module';
import { PreguntaInformacionGeneralComponent } from './componentes/pregunta-informacion-general/pregunta-informacion-general.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputsModule } from '../inputs/inputs.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { EncuestasModule } from '../encuestas/encuestas.module';
import { TablaSedesComponent } from './componentes/tabla-sedes/tabla-sedes.component';
import { TablaPatiosComponent } from './componentes/tabla-patios/tabla-patios.component';
import { TablaEmpresasJurisdiccionComponent } from './componentes/tabla-empresas-jurisdiccion/tabla-empresas-jurisdiccion.component';



@NgModule({
  declarations: [
    ClasificacionInformacionGeneralComponent,
    PreguntaInformacionGeneralComponent,
    TablaSedesComponent,
    TablaPatiosComponent,
    TablaEmpresasJurisdiccionComponent
  ],
  imports: [
    CommonModule,
    InformacionGeneralRoutingModule,
    AlertasModule,
    FormsModule,
    ReactiveFormsModule,
    InputsModule,
    NgbModule
  ],
  exports: [
    TablaSedesComponent,
    TablaPatiosComponent,
    TablaEmpresasJurisdiccionComponent
  ]
})
export class InformacionGeneralModule { }
