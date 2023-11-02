import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaginaTarifasComponent } from './paginas/pagina-tarifas/pagina-tarifas.component';


const routes: Routes = [
  
  {
    path: '',
    component: PaginaTarifasComponent 
  }/* ,
  {
    path: ''
  } */
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TarifasRoutingModule { }
