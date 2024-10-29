import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaginaGestionPolizaComponent } from './paginas/pagina-gestion-polizas/pagina-gestion-poliza';

const routes: Routes = [
 
  {
    path: '',
    component: PaginaGestionPolizaComponent 
  } /*
  {
    path: ':idVigilado',
    component: PaginaVisualizarTarifasComponent
  }*/
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PolizaRoutingModule { }