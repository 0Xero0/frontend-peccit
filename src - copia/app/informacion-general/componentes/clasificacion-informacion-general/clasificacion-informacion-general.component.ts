import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { PreguntaEncuestaComponent } from 'src/app/encuestas/componentes/pregunta-encuesta/pregunta-encuesta.component';
import { Clasificacion } from 'src/app/encuestas/modelos/Encuesta';
import { Respuesta } from 'src/app/encuestas/modelos/Respuesta';
import { RespuestaVerificacion } from 'src/app/encuestas/modelos/RespuestaVerificacion';
import { Maestra } from 'src/app/verificaciones/modelos/Maestra';
import { PreguntaInformacionGeneralComponent } from '../pregunta-informacion-general/pregunta-informacion-general.component';
import { RespuestaInvalida } from 'src/app/encuestas/modelos/RespuestaInvalida';

@Component({
  selector: 'app-clasificacion-informacion-general',
  templateUrl: './clasificacion-informacion-general.component.html',
  styleUrls: ['./clasificacion-informacion-general.component.css']
})
export class ClasificacionInformacionGeneralComponent implements OnInit {
  @ViewChildren('pregunta') preguntas!: QueryList<PreguntaInformacionGeneralComponent>
  @Output('preguntasRespondidas') seHanRespondidoPreguntas: EventEmitter<Respuesta[]>
  @Output('verificacionesRespondidas') seHanRespondidoVerificaciones: EventEmitter<RespuestaVerificacion>
  @Output('haHabidoErrorArchivo') haHabidoErrorArchivo: EventEmitter<HttpErrorResponse>
  @Output('archivoExcedeTamano') archivoExcedeTamano: EventEmitter<number>

  @Input('idVigilado') idVigilado!: string
  @Input('clasificacion') clasificacion!: Clasificacion
  @Input('soloLectura') soloLectura: boolean = true
  @Input('camposDeVerificacion') camposDeVerificacion: boolean = false
  @Input('camposDeVerificacionVisibles') camposDeVerificacionVisibles: boolean = false
  @Input('observacion') observacion: boolean  = false
  @Input('justificable') justificable: boolean = false
  @Input('opcionesCumplimiento') opcionesCumplimiento: Maestra[] = []
  @Input('opcionesCorrespondencia') opcionesCorrespondencia: Maestra[] = []
  desplegado: boolean = true
  preguntasRespondidas: Respuesta[] = []
  verificacionesRespondidas: RespuestaVerificacion[] = []

  constructor() { 
    this.seHanRespondidoPreguntas = new EventEmitter<Respuesta[]>();
    this.seHanRespondidoVerificaciones = new EventEmitter<RespuestaVerificacion>();
    this.haHabidoErrorArchivo = new EventEmitter<HttpErrorResponse>();
    this.archivoExcedeTamano = new EventEmitter<number>();
  }

  ngOnInit(): void {
  }

  //Obtener recursos
  obtenerRespuestas(): Respuesta[]{
    return this.preguntasRespondidas
  }

  obtenerVerificaciones(): RespuestaVerificacion[]{
    return this.verificacionesRespondidas
  }

  //Manejadores de eventos
  manejarErrorCargaArchivo(error: HttpErrorResponse){
    this.haHabidoErrorArchivo.emit(error)
  }

  manejarArchivoExcedeTamano(tamano: number){
    this.archivoExcedeTamano.emit(tamano)
  }

  manejarNuevaVerificacion(verificacion: RespuestaVerificacion){
    this.agregarVerificacionRespondida(verificacion)
    this.seHanRespondidoVerificaciones.emit(verificacion)
  }

  //Acciones
  alternarDesplegar(){
    this.desplegado = !this.desplegado
  }

  agregarPreguntaRespondida(respuesta: Respuesta){
    if(this.existePreguntaRespondida(respuesta)){
      this.eliminarPreguntaRespondida(respuesta)
      this.preguntasRespondidas.push(respuesta)
    }
    this.preguntasRespondidas.push(respuesta)
    this.seHanRespondidoPreguntas.emit(this.preguntasRespondidas)
  }

  agregarVerificacionRespondida(verificacion: RespuestaVerificacion){
    if(this.existeVerificacionRespondida(verificacion)){
      this.eliminarVerificacionRespondida(verificacion)
    }
    this.verificacionesRespondidas.push(verificacion)
  }

  existePreguntaRespondida(respuesta: Respuesta):boolean{
    const idPreguntasRespondidas = this.preguntasRespondidas.map( preguntaRespondida => preguntaRespondida.preguntaId )
    return idPreguntasRespondidas.includes( respuesta.preguntaId ) ? true : false
  }

  existeVerificacionRespondida(verificacion: RespuestaVerificacion): boolean{
    const idVerificacionRepondida = this.verificacionesRespondidas.map( verificacionRespondida => verificacionRespondida.preguntaId )
    return idVerificacionRepondida.includes( verificacion.preguntaId ) ? true : false
  }

  eliminarPreguntaRespondida(respuesta: Respuesta): void{
    this.preguntasRespondidas = this.preguntasRespondidas.filter( preguntaRespondida => { 
      return preguntaRespondida.preguntaId !== respuesta.preguntaId ? true : false
    })
  }

  eliminarVerificacionRespondida(verificacion: RespuestaVerificacion): void{
    this.verificacionesRespondidas = this.verificacionesRespondidas.filter( verificacionRespondida =>{
      return verificacionRespondida.preguntaId !== verificacion.preguntaId ? true : false
    })
  }

  resaltarRespuestasInvalidas(invalidas: RespuestaInvalida[]){ //reemplazar esto por un observable
    const idInvalidas = invalidas.map( invalida => invalida.preguntaId ) 
    this.preguntas.forEach( pregunta =>{
      if( idInvalidas.includes(pregunta.pregunta.idPregunta) ){
        pregunta.marcarInvalida()
      }
    })
  }

}
