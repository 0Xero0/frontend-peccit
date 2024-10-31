import { Component, OnInit, ViewChild } from '@angular/core';
import { ServicioEjecucion } from '../../servicios/ejecucion.service';
import { FormularioEjecucion } from '../../modelos/FormularioEjecucion';
import { HttpErrorResponse } from '@angular/common/http';
import { PopupComponent } from 'src/app/alertas/componentes/popup/popup.component';
import { ServicioLocalStorage } from 'src/app/administrador/servicios/local-storage.service';
import { ErrorAutorizacion } from 'src/app/errores/ErrorAutorizacion';
import { DialogosEjecucion } from '../../DialogosEjecucion';
import { DateTime } from 'luxon';
import { ActivatedRoute } from '@angular/router';
import { Mes } from 'src/app/encuestas/modelos/Mes';
import { MenuHeaderPService } from 'src/app/services-menu-p/menu-header-p-service';

@Component({
  selector: 'app-pagina-ejecucion',
  templateUrl: './pagina-ejecucion.component.html',
  styleUrls: ['./pagina-ejecucion.component.css']
})
export class PaginaEjecucionComponent implements OnInit{
  @ViewChild('popup') popup!: PopupComponent
  idMes?: number;
  esUsuarioVigilado: boolean;
  idReporte?: number;
  idVigilado?: string
  historico: boolean = false;
  meses: Mes[] = []

  constructor(
    private servicio: ServicioEjecucion, 
    private servicioLocalStorage: ServicioLocalStorage,
    private activatedRoute: ActivatedRoute,
    private ServiceMenuP:MenuHeaderPService
    ){
    const usuario = this.servicioLocalStorage.obtenerUsuario();
    const rol = this.servicioLocalStorage.obtenerRol();
    if(!usuario) throw new ErrorAutorizacion();
    if(!rol) throw new ErrorAutorizacion();
    this.esUsuarioVigilado = rol.id === '003' ? true : false;
  }

  formulario?: FormularioEjecucion

  ngOnInit(): void {
    
    this.activatedRoute.queryParams.subscribe({
      next: (params) =>{
        this.idReporte = params['reporte']
        this.idVigilado = params['vigilado']
        if(this.esUsuarioVigilado){
          let parametroHistoricoString = params['historico']
          this.historico = parametroHistoricoString === 'true' ? true : false;    
        }else{
          this.historico = true
        }
        this.servicio.obtenerMeses(this.historico).subscribe({
          next: (respuesta)=>{
            if(respuesta.meses.length > 0){
              this.meses = respuesta.meses;
              this.idMes = respuesta.meses[0].idMes;
              this.obtenerEjecucion(this.idReporte!, this.idVigilado!, this.idMes)
            }else{
              this.popup.abrirPopupFallido('Ocurrió un error.', 'Ocurrió un error al obtener los periodos.')
            }
          },
          error: ()=>{
            this.popup.abrirPopupFallido('Ocurrió un error.', 'Ocurrió un error al obtener los periodos.')
          }
        })    
      }
    })
    this.ServiceMenuP.RutaModelo=`/reportes-ejecucio`;//paolo
  }

  obtenerEjecucion(idReporte: number, idVigilado: string, idMes: number){
    this.ServiceMenuP.RutaModelo=`/reportes-ejecucio`;//paolo
    
    this.servicio.consultarEjecucion(idReporte, idVigilado, idMes, this.historico).subscribe({
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
  }

  // Manejadores de eventos
  manejarCambioDeMes(idMes: number){
    this.idMes = idMes
    this.obtenerEjecucion(this.idReporte!, this.idVigilado!, idMes)
  }

  manejarFormularioGuardado(){
    this.obtenerEjecucion(this.idReporte!, this.idVigilado!, this.idMes!)
  }

  manejarRecargar(){
    this.obtenerEjecucion(this.idReporte!, this.idVigilado!, this.idMes!)
  }
}
