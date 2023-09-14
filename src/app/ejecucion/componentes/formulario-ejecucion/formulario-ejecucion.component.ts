import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormularioEjecucion } from '../../modelos/FormularioEjecucion';
import { RespuestaActividad } from '../../modelos/RespuestaActividad';
import { RespuestaAdicional } from '../../modelos/RespuestaAdicional';
import { ServicioEjecucion } from '../../servicios/ejecucion.service';
import { PopupComponent } from 'src/app/alertas/componentes/popup/popup.component';
import { DialogosEjecucion } from '../../DialogosEjecucion';
import { HttpErrorResponse } from '@angular/common/http';
import { DateTime } from 'luxon';
import { Mes } from 'src/app/encuestas/modelos/Mes';

@Component({
  selector: 'app-formulario-ejecucion',
  templateUrl: './formulario-ejecucion.component.html',
  styleUrls: ['./formulario-ejecucion.component.css']
})
export class FormularioEjecucionComponent implements OnInit{
  @ViewChild('popup') popup!: PopupComponent
  @Output() cambioDeMes: EventEmitter<number>
  @Output() formularioGuardado: EventEmitter<void>
  @Input() formulario!: FormularioEjecucion
  
  actividadesFaltantes: number[] = []
  adicionalesFaltantes: number[] = []

  respuestasActividades: RespuestaActividad[] = []
  respuestasAdicionales: RespuestaAdicional[] = []
  hayCambios: boolean = false
  meses: Mes[] = []
  idMes: number;

  constructor(private servicio: ServicioEjecucion){
    this.cambioDeMes = new EventEmitter<number>();
    this.formularioGuardado = new EventEmitter<void>();
    this.idMes = DateTime.now().month
  }

  ngOnInit(): void {
    this.obtenerMeses()
  }

  guardar(){
    this.servicio.guardarEjecucion(
      +this.formulario.idReporte, 
      this.respuestasActividades, 
      this.respuestasAdicionales
    ).subscribe({
      next: ()=>{
        this.popup.abrirPopupExitoso(DialogosEjecucion.GUARDAR_EJECUCION_EXITO)
        this.hayCambios = false;
        this.formularioGuardado.emit()
        this.actividadesFaltantes = []
        this.adicionalesFaltantes = []
      },
      error: ()=>{
        this.popup.abrirPopupFallido(
          DialogosEjecucion.GUARDAR_EJECUCION_ERROR_TITULO,
          DialogosEjecucion.GUARDAR_EJECUCION_ERROR_DESCRIPCION
        )
      }
    })
  }

  enviar(){
    this.servicio.enviarEjecucion(+this.formulario.idReporte, this.formulario.idVigilado, this.idMes).subscribe({
      next: ()=>{
        this.popup.abrirPopupExitoso(DialogosEjecucion.ENVIAR_EJECUCION_EXITO)
      },
      error: (error: HttpErrorResponse)=>{
        this.actividadesFaltantes = error.error.faltantesActividades
        this.adicionalesFaltantes = error.error.faltantesAdicionales
        this.popup.abrirPopupFallido(
          DialogosEjecucion.ENVIAR_EJECUCION_ERROR_GENERICO_TITULO, 
          DialogosEjecucion.ENVIAR_EJECUCION_ERROR_GENERICO_DESCRIPCION
        )
      }
    })
  }

  obtenerMeses(){
    this.servicio.obtenerMeses().subscribe({
      next: (respuesta)=>{
        this.meses = respuesta.meses
      }
    })
  }

  manejarCambioDeMes(idMes: number){
    this.idMes = idMes
    this.cambioDeMes.emit(idMes)
  }

  manejarNuevasActividades(respuestas: RespuestaActividad[]){
    this.respuestasActividades = respuestas
    this.hayCambios = true;
  }

  manejarNuevosAdicionales(respuestas: RespuestaAdicional[]){
    this.respuestasAdicionales = respuestas
    this.hayCambios = true;
  }
}
