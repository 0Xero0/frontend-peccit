import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginaInformacionGeneralComponent } from './paginas/pagina-informacion-general/pagina-informacion-general.component';
import { InformacionGeneralRoutingModule } from './informacion-general-routing.module';
import { FormularioInformacionGeneralComponent } from './componentes/formulario-informacion-general/formulario-informacion-general.component';
import { ClasificacionInformacionGeneralComponent } from './componentes/clasificacion-informacion-general/clasificacion-informacion-general.component';
import { AlertasModule } from '../alertas/alertas.module';
import { PreguntaInformacionGeneralComponent } from './componentes/pregunta-informacion-general/pregunta-informacion-general.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputsModule } from '../inputs/inputs.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { EncuestasModule } from '../encuestas/encuestas.module';



@NgModule({
  declarations: [
    PaginaInformacionGeneralComponent,
    FormularioInformacionGeneralComponent,
    ClasificacionInformacionGeneralComponent,
    PreguntaInformacionGeneralComponent
  ],
  imports: [
    CommonModule,
    InformacionGeneralRoutingModule,
    AlertasModule,
    FormsModule,
    ReactiveFormsModule,
    InputsModule,
    NgbModule,
    EncuestasModule
  ]
})
export class InformacionGeneralModule { }
