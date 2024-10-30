import { Component, OnInit } from '@angular/core';
import { ServicioLocalStorage } from 'src/app/administrador/servicios/local-storage.service';
import { Usuario } from 'src/app/autenticacion/modelos/IniciarSesionRespuesta';
import { Rol } from 'src/app/autenticacion/modelos/Rol';
import { ServicioEncuestas } from '../../servicios/encuestas.service';
import { ResumenReporte } from '../../modelos/ResumenReporte';
import { ActivatedRoute, Router } from '@angular/router';
import { CategorizacionService } from 'src/app/categorizacion/servicios/categorizacion.service';
import { Paginador } from 'src/app/administrador/modelos/compartido/Paginador';
import { Observable } from 'rxjs';
import { Paginacion } from 'src/app/compartido/modelos/Paginacion';
import { FiltrosReportes } from '../../modelos/FiltrosReportes';
import { ErrorAutorizacion } from 'src/app/errores/ErrorAutorizacion';
import { MenuHeaderPService } from 'src/app/services-menu-p/menu-header-p-service';

@Component({
  selector: 'app-listado-encuestas',
  templateUrl: './listado-encuestas.component.html',
  styleUrls: ['./listado-encuestas.component.css']
})
export class ListadoEncuestasComponent implements OnInit {
  paginador: Paginador<FiltrosReportes>
  usuarioCategorizado: boolean = true
  encuestaCategorizable: boolean = true
  usuario: Usuario | null
  rol: Rol | null
  reportes: ResumenReporte[] = []
  vigilado?: string
  idEncuesta?: number
  termino: string = ""
  esUsuarioVigilado: boolean;

  constructor(
    private servicioEncuestas: ServicioEncuestas,
    private servicioCategorizacion: CategorizacionService,
    private servicioLocalStorage: ServicioLocalStorage,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private ServiceMenuP:MenuHeaderPService
  ) {
    this.paginador = new Paginador<FiltrosReportes>(this.obtenerEncuestas)
    this.usuario = this.servicioLocalStorage.obtenerUsuario()
    this.rol = this.servicioLocalStorage.obtenerRol()
    if(!this.rol) throw new ErrorAutorizacion();
    this.esUsuarioVigilado = this.rol.id !== '003' ? false : true;
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe({
      next: (params) => {
        this.idEncuesta = params["idEncuesta"]
        this.servicioCategorizacion.informacionCategorizacion(this.idEncuesta).subscribe({
          next: (informacion) => {
            if (!informacion.categorizado && informacion.encuestaCategorizable) {
              this.router.navigateByUrl('/administrar/categorizacion')
              return;
            }
            this.paginador.inicializar()
          }
        })
      }
    })
    //this.ServiceMenuP.RutaModelo=`/administrar/encuestas/${this.idEncuesta}`;//paolo
  }

  obtenerEncuestas = (pagina: number, limite: number, filtros?: FiltrosReportes) => {
    return new Observable<Paginacion>(subscriptor => {
      this.servicioEncuestas.obtenerEncuestas(pagina, limite, this.usuario!.usuario, this.idEncuesta!, filtros).subscribe({
        next: (respuesta) => {
          this.reportes = respuesta.reportadas
          if(this.esUsuarioVigilado){
            //console.log('------DESDE ENCUESTA--------------')
            //console.log(this.router.url)
            //this.ServiceMenuP.RutaModelo=this.router.url
            //console.log('--------------------')
            //this.ServiceMenuP.AsginarRutas(this.router.url,`/administrar/encuesta/${this.idEncuesta}`);//paolo
            this.ServiceMenuP.OptionMenu=(this.idEncuesta==1) ? 1 :2/**paolo */          
            //this.ServiceMenuP.RutaModelo=`/administrar/encuestas/${this.idEncuesta}`;//paolo
            //console.log(this.ServiceMenuP.RutaModelo)
            this.router.navigate(['/administrar', 'encuesta', this.idEncuesta], {
              queryParams: {
                vigilado: this.reportes[0].idVigilado,
                reporte: this.reportes[0].numeroReporte
              }
            })
          }
          subscriptor.next(respuesta.paginacion)
        }
      })
    })
  }

  actualizarFiltros() {
    this.paginador.filtrar({ termino: this.termino })
  }

}
