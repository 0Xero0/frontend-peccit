import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaginaTarifasComponent } from './paginas/pagina-tarifas/pagina-tarifas.component';
import { PaginaVisualizarTarifasComponent } from './paginas/pagina-visualizar-tarifas/pagina-visualizar-tarifas.component';


const routes: Routes = [
  
  {
    path: '',
    component: PaginaTarifasComponent 
  },
  {
    path: ':idVigilado',
    component: PaginaVisualizarTarifasComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TarifasRoutingModule { }
