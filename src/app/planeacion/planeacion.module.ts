import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginaPlaneacionComponent } from './paginas/pagina-planeacion/pagina-planeacion.component';
import { PlaneacionRoutingModule } from './planeacion-routing.module';
import { TablaObjetivosComponent } from './componentes/tabla-objetivos/tabla-objetivos.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AlertasModule } from '../alertas/alertas.module';
import { CalendarioActividadesComponent } from './componentes/calendario-actividades/calendario-actividades.component';
import { MesCalendarioComponent } from './componentes/mes-calendario/mes-calendario.component';



@NgModule({
  declarations: [
    PaginaPlaneacionComponent,
    TablaObjetivosComponent,
    CalendarioActividadesComponent,
    MesCalendarioComponent
  ],
  imports: [
    CommonModule,
    PlaneacionRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    AlertasModule
  ],
  exports: [
    TablaObjetivosComponent,
    CalendarioActividadesComponent
  ]
})
export class PlaneacionModule { }
