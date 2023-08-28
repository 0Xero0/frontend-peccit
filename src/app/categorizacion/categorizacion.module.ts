import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginaCategorizacion } from './paginas/pagina-categorizacion/pagina-categorizacion.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormularioModalidadRadioOperacionComponent } from './componentes/formulario-modalidad-radio-operacion/formulario-modalidad-radio-operacion.component';
import { TipoCategoriaComponent } from './componentes/tipo-categoria/tipo-categoria.component';
import { CategoriaComponent } from './componentes/categoria/categoria.component';
import { SelectorCantidadComponent } from './componentes/selector-cantidad/selector-cantidad.component';
import { AlertasModule } from '../alertas/alertas.module';
import { ModalConfirmacionComponent } from './componentes/modal-confirmacion/modal-confirmacion.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PaginaAsignacionTamanoOrganizacionComponent } from './paginas/pagina-asignacion-tamano-organizacion/pagina-asignacion-tamano-organizacion.component';
import { RouterModule } from '@angular/router';
import { NavegacionModule } from '../navegacion/navegacion.module';



@NgModule({
  declarations: [
    PaginaCategorizacion,
    FormularioModalidadRadioOperacionComponent,
    TipoCategoriaComponent,
    CategoriaComponent,
    SelectorCantidadComponent,
    ModalConfirmacionComponent,
    PaginaAsignacionTamanoOrganizacionComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    FormsModule,
    NgbModule,
    AlertasModule,
    NavegacionModule
  ]
})
export class CategorizacionModule { }
