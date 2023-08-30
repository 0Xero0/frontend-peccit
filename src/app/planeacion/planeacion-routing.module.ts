import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaginaPlaneacionComponent } from './paginas/pagina-planeacion/pagina-planeacion.component';


const routes: Routes = [
  
  {
    path: '',
    component: PaginaPlaneacionComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlaneacionRoutingModule { }
