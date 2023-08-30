import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaginaInformacionGeneralComponent } from './paginas/pagina-informacion-general/pagina-informacion-general.component';
import { PaginaEncuestaComponent } from '../encuestas/paginas/pagina-encuesta/pagina-encuesta.component';
import { ListadoEncuestasComponent } from '../encuestas/paginas/listado-encuestas/listado-encuestas.component';


const routes: Routes = [
  
  {
    path: '',
    component: ListadoEncuestasComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InformacionGeneralRoutingModule { }
