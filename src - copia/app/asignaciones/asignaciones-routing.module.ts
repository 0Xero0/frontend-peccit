import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaginaAsignacionComponent } from './paginas/pagina-asignacion/pagina-asignacion.component';


const routes: Routes = [
  
  {
    path: '',
    component: PaginaAsignacionComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AsignacionesRoutingModule { }
