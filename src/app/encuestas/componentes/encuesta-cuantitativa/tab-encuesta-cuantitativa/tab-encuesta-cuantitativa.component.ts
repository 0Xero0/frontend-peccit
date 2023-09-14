import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Evidencia, SubIndicador } from 'src/app/encuestas/modelos/EncuestaCuantitativa';
import { Respuesta } from 'src/app/encuestas/modelos/Respuesta';
import { RespuestaEvidencia } from 'src/app/encuestas/modelos/RespuestaEvidencia';
import { Actividad } from 'src/app/planeacion/modelos/Actividad';
import { Objetivo } from 'src/app/planeacion/modelos/Objetivo';

@Component({
  selector: 'app-tab-encuesta-cuantitativa',
  templateUrl: './tab-encuesta-cuantitativa.component.html',
  styleUrls: ['./tab-encuesta-cuantitativa.component.css']
})
export class TabEncuestaCuantitativaComponent implements OnInit{
  @Input() objetivos: Objetivo[] = []
  @Input() cabecerasActividades: string[] = []
  @Input() actividades: Actividad[] = []
  @Input() idVigilado!: string
  @Input() subindicadores: SubIndicador[] = []
  @Input() evidencias: Evidencia[] = []
  @Input() mensaje!: string
  @Input() estadoRespuestas: Respuesta[] = []
  @Input() evidenciasFaltantes: number[] = []
  @Input() indicadoresFaltantes: number[] = []
  @Input() actividadesFaltantes: number[] = []
  @Input() soloLectura: boolean = false

  @Output() nuevaRespuesta: EventEmitter<Respuesta>
  @Output() nuevaEvidencia: EventEmitter<RespuestaEvidencia>
  @Output() nuevosObjetivos: EventEmitter<string[]>
  @Output() evidenciaExcedeTamano: EventEmitter<number>
  @Output() errorAlCargarEvidencia: EventEmitter<HttpErrorResponse>
  respuestas: Respuesta[] = [];
  
  

  constructor(){
    this.nuevaRespuesta = new EventEmitter<Respuesta>();
    this.nuevaEvidencia = new EventEmitter<RespuestaEvidencia>();
    this.nuevosObjetivos = new EventEmitter<string[]>();
    this.evidenciaExcedeTamano = new EventEmitter<number>();
    this.errorAlCargarEvidencia = new EventEmitter<HttpErrorResponse>();
  }

  ngOnInit(): void {}

  manejarNuevosObjetivos(objetivos: string[]){
    this.nuevosObjetivos.emit(objetivos)
  }

  manejarEvidenciaExcedeTamano(tamano: number){
    this.evidenciaExcedeTamano.emit(tamano)
  }

  manejarNuevaRespuesta(respuesta: Respuesta){
    console.log('nueva respuesta', respuesta)
    this.nuevaRespuesta.emit(respuesta)
  }

  manejarNuevaEvidencia(respuesta: RespuestaEvidencia){
    this.nuevaEvidencia.emit(respuesta)
  }

  manejarErrorAlCargar(error: HttpErrorResponse){
    this.errorAlCargarEvidencia.emit(error)
  }
}
