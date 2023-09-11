import { Component, OnInit, ViewChild } from '@angular/core';
import { ServicioEjecucion } from '../../servicios/ejecucion.service';
import { FormularioEjecucion } from '../../modelos/FormularioEjecucion';
import { HttpErrorResponse } from '@angular/common/http';
import { PopupComponent } from 'src/app/alertas/componentes/popup/popup.component';
import { ServicioLocalStorage } from 'src/app/administrador/servicios/local-storage.service';
import { ErrorAutorizacion } from 'src/app/errores/ErrorAutorizacion';
import { DialogosEjecucion } from '../../DialogosEjecucion';
import { DateTime } from 'luxon';

@Component({
  selector: 'app-pagina-ejecucion',
  templateUrl: './pagina-ejecucion.component.html',
  styleUrls: ['./pagina-ejecucion.component.css']
})
export class PaginaEjecucionComponent implements OnInit{
  @ViewChild('popup') popup!: PopupComponent
  idVigilado: string
  idMes: number;

  constructor(private servicio: ServicioEjecucion, private servicioLocalStorage: ServicioLocalStorage){
    const usuario = this.servicioLocalStorage.obtenerUsuario()
    if(!usuario){
      throw new ErrorAutorizacion();
    }
    this.idVigilado = usuario.usuario
    this.idMes = DateTime.now().month
  }

  formulario?: FormularioEjecucion

  ngOnInit(): void {
    this.obtenerEjecucion(this.idMes)
  }

  obtenerEjecucion(idMes: number){
    this.servicio.consultarListaFormulariosEjecucion(1, 5, this.idVigilado).subscribe({
      next: (respuesta)=>{
        if(respuesta.reportadas.length > 0){
          const reporte = respuesta.reportadas[0];
          this.servicio.consultarEjecucion(reporte.idEncuestaDiligenciada, this.idVigilado, idMes).subscribe({
            next: (formulario)=>{
              this.formulario = formulario
            },
            error: (error: HttpErrorResponse)=>{
              if(error.status === 404){
                this.popup.abrirPopupFallido(
                  DialogosEjecucion.EJECUCION_NO_ENCONTRADA_TITULO,
                  DialogosEjecucion.EJECUCION_NO_ENCONTRADA_DESCRIPCION
                )
              }else{
                this.popup.abrirPopupFallido(
                  DialogosEjecucion.ERROR_GENERICO_TITULO, 
                  DialogosEjecucion.ERROR_GENERICO_DESCRIPCION
                )
              }
            },
            complete: ()=>{
      
            }
          })
        }else{
          this.popup.abrirPopupFallido(
            DialogosEjecucion.EJECUCION_NO_ENCONTRADA_TITULO,
            DialogosEjecucion.EJECUCION_NO_ENCONTRADA_DESCRIPCION
          )
        }
      },
      error: (error: HttpErrorResponse)=>{
        this.popup.abrirPopupFallido(
          DialogosEjecucion.ERROR_GENERICO_TITULO, 
          DialogosEjecucion.ERROR_GENERICO_DESCRIPCION
        )
      }
    })
  }

  manejarCambioDeMes(idMes: number){
    this.obtenerEjecucion(idMes)
  }
}
