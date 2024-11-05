import { Component, OnInit, ViewChild } from '@angular/core';
import { ServicioEjecucion } from '../../servicios/ejecucion.service';
import { ResumenReporte } from 'src/app/encuestas/modelos/ResumenReporte';
import { Observable } from 'rxjs';
import { Paginacion } from 'src/app/compartido/modelos/Paginacion';
import { Paginador } from 'src/app/administrador/modelos/compartido/Paginador';
import { FiltrosReportes } from 'src/app/encuestas/modelos/FiltrosReportes';
import { Usuario } from 'src/app/autenticacion/modelos/IniciarSesionRespuesta';
import { ServicioLocalStorage } from 'src/app/administrador/servicios/local-storage.service';
import { ErrorAutorizacion } from 'src/app/errores/ErrorAutorizacion';
import { HttpErrorResponse } from '@angular/common/http';
import { PopupComponent } from 'src/app/alertas/componentes/popup/popup.component';
import { Router } from '@angular/router';
import { MenuHeaderPService } from 'src/app/services-menu-p/menu-header-p-service';

@Component({
  selector: 'app-pagina-listado-ejecucion',
  templateUrl: './pagina-listado-ejecucion.component.html',
  styleUrls: ['./pagina-listado-ejecucion.component.css']
})
export class PaginaListadoEjecucionComponent implements OnInit{
  @ViewChild('popup') popup!: PopupComponent
  paginador: Paginador<FiltrosReportes>
  reportes: ResumenReporte[] = []
  usuario: Usuario;
  termino: string = "";
  esUsuarioVigilado: boolean;

  constructor(
    private servicio: ServicioEjecucion, 
    private servicioLocalStorage: ServicioLocalStorage,
    private router: Router,
    private ServiceMenuP:MenuHeaderPService){
    this.paginador = new Paginador<FiltrosReportes>(this.obtenerReportes)
    const usuario = this.servicioLocalStorage.obtenerUsuario()
    const rol = this.servicioLocalStorage.obtenerRol()
    if(!usuario) throw new ErrorAutorizacion();
    if(!rol) throw new ErrorAutorizacion();
    this.usuario = usuario;
    this.esUsuarioVigilado = rol.id === '003' ? true : false;
  }
  
  ngOnInit(){
    this.paginador.inicializar()
  }

  obtenerReportes = (pagina: number, limite: number, filtros?: FiltrosReportes): Observable<Paginacion> =>{
    return new Observable(subscripcion => {
      this.servicio.consultarListaFormulariosEjecucion(pagina, limite, this.usuario.usuario, filtros).subscribe({
        next: (respuesta)=>{
          this.reportes = respuesta.reportadas
          if(this.esUsuarioVigilado && this.reportes.length > 0){

            this.ServiceMenuP.AsginarRutas(this.router.url,'/administrar/ejecucion'); ///paolo
            this.router.navigate(['/administrar', 'ejecucion'], {queryParams: {
              reporte: this.reportes[0].numeroReporte,
              vigilado: this.reportes[0].idVigilado
            }})
          }
          subscripcion.next(respuesta.paginacion) 
        },
        error: (error: HttpErrorResponse)=>{
          this.popup.abrirPopupFallido('Error al consultar los reportes.', error.error.message ?? 'Consulta con el administrador del sistema.')
        }
      })
    })
  }

  actualizarFiltros(){
    this.paginador.filtrar({
      termino: this.termino
    })
  }
}
