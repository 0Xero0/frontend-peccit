import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaginaReportesVerificarComponent } from './paginas/pagina-reportes-verificar/pagina-reportes-verificar.component';
import { PaginaReporteVerificarComponent } from './paginas/pagina-reporte-verificar/pagina-reporte-verificar.component';



const routes: Routes = [
  
  {
    path: '',
    component: PaginaReportesVerificarComponent
  },
  {
    path: ':idReporte',
    component: PaginaReporteVerificarComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VerificacionesRoutingModule { }
