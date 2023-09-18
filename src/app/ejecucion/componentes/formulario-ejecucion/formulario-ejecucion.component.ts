import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormularioEjecucion } from '../../modelos/FormularioEjecucion';
import { RespuestaActividad } from '../../modelos/RespuestaActividad';
import { RespuestaAdicional } from '../../modelos/RespuestaAdicional';
import { ServicioEjecucion } from '../../servicios/ejecucion.service';
import { PopupComponent } from 'src/app/alertas/componentes/popup/popup.component';
import { DialogosEjecucion } from '../../DialogosEjecucion';
import { HttpErrorResponse } from '@angular/common/http';
import { DateTime } from 'luxon';
import { Mes } from 'src/app/encuestas/modelos/Mes';
import { Router } from '@angular/router';

@Component({
  selector: 'app-formulario-ejecucion',
  templateUrl: './formulario-ejecucion.component.html',
  styleUrls: ['./formulario-ejecucion.component.css']
})
export class FormularioEjecucionComponent implements OnInit, OnChanges{
  @ViewChild('popup') popup!: PopupComponent
  @Output() recargar: EventEmitter<void>
  @Output() cambioDeMes: EventEmitter<number>
  @Output() formularioGuardado: EventEmitter<void>
  @Input() formulario!: FormularioEjecucion
  @Input() historico: boolean = false
  @Input() esVigilado: boolean = true
  
  actividadesFaltantes: number[] = []
  adicionalesFaltantes: number[] = []

  respuestasActividades: RespuestaActividad[] = []
  respuestasAdicionales: RespuestaAdicional[] = []
  hayCambios: boolean = false
  meses: Mes[] = []
  idMes?: number;

  constructor(private servicio: ServicioEjecucion, private router: Router){
    this.cambioDeMes = new EventEmitter<number>();
    this.formularioGuardado = new EventEmitter<void>();
    this.recargar = new EventEmitter<void>();
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if(changes['historico']){
      this.obtenerMeses()
      this.recargar.emit()
    }
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
    this.servicio.enviarEjecucion(+this.formulario.idReporte, this.formulario.idVigilado, this.idMes!).subscribe({
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
    this.servicio.obtenerMeses(this.historico).subscribe({
      next: (respuesta)=>{
        this.meses = respuesta.meses
        if(this.meses.length > 0){
          this.idMes = this.meses[0].idMes
        }
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

  irAHistorico(){
    this.router.navigate(['/administrar', 'ejecucion'], { queryParams: {
      reporte: this.formulario.idReporte,
      vigilado: this.formulario.idVigilado,
      historico: true
    }})
  }

  salirDeHistorico(){
    this.router.navigate(['/administrar', 'ejecucion'], { queryParams: {
      reporte: this.formulario.idReporte,
      vigilado: this.formulario.idVigilado,
      historico: false
    }})
  }
}
