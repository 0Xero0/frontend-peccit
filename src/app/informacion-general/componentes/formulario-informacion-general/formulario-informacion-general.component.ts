import { Component, ElementRef, EventEmitter, Input, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { PopupComponent } from 'src/app/alertas/componentes/popup/popup.component';
import { ClasificacionInformacionGeneralComponent } from '../clasificacion-informacion-general/clasificacion-informacion-general.component';
import { Encuesta } from 'src/app/encuestas/modelos/Encuesta';
import { Respuesta } from 'src/app/encuestas/modelos/Respuesta';
import { RespuestaVerificacion } from 'src/app/encuestas/modelos/RespuestaVerificacion';
import { Maestra } from 'src/app/verificaciones/modelos/Maestra';
import { ServicioEncuestas } from 'src/app/encuestas/servicios/encuestas.service';
import { ServicioVerificaciones } from 'src/app/verificaciones/servicios/verificaciones.service';
import { DialogosEncuestas } from 'src/app/encuestas/dialogos-encuestas';
import { HttpErrorResponse } from '@angular/common/http';
import { RespuestaInvalida } from 'src/app/encuestas/modelos/RespuestaInvalida';

@Component({
  selector: 'app-formulario-informacion-general',
  templateUrl: './formulario-informacion-general.component.html',
  styleUrls: ['./formulario-informacion-general.component.css']
})
export class FormularioInformacionGeneralComponent {
  @Input('encuesta') encuesta!: Encuesta
  @Input('idReporte') idReporte!: number
  @Input('idEncuesta') idEncuesta!: number
  @Input('idVigilado') idVigilado!: string
  @Input('soloLectura') soloLectura: boolean = true
  @Input('justificable') justificable: boolean = false
  @Input('camposDeVerificacion') camposDeVerificacion: boolean = false
  @Input('camposDeVerificacionVisibles') camposDeVerificacionVisibles: boolean = true
  @Output('hanHabidoCambios') hanHabidoCambios: EventEmitter<boolean>
  @ViewChildren('clasificacion') clasificaciones!: QueryList<ClasificacionInformacionGeneralComponent>
  @ViewChild('popup') popup!: PopupComponent
  @ViewChild('contenedorEncuesta') contenedorEncuesta!: ElementRef
  respuestas: Respuesta[] = []
  verificaciones: RespuestaVerificacion[] = []
  hayCambios: boolean = false
  opcionesCumplimiento: Maestra[] = []
  opcionesCorrespondencia: Maestra[] = []

  constructor(
    private servicioEncuestas: ServicioEncuestas,
    private servicioVerificacion: ServicioVerificaciones,
  ){
    this.hanHabidoCambios = new EventEmitter<boolean>();
  }

  ngOnInit(): void {
    this.obtenerOpcionesCumplimientoYCorrespondencia()
  }

  //Obtener recursos
  obtenerRespuestas(): Respuesta[]{
    this.respuestas = []
    this.clasificaciones.forEach(clasificacion => {
      this.respuestas = [ ...this.respuestas, ...clasificacion.obtenerRespuestas()]
    })
    return this.respuestas
  }

  obtenerVerificaciones(): RespuestaVerificacion[]{
    this.verificaciones = []
    this.clasificaciones.forEach(clasificacion => {
      this.verificaciones = [ ...this.verificaciones, ...clasificacion.obtenerVerificaciones()]
    })
    return this.verificaciones
  }

  obtenerOpcionesCumplimientoYCorrespondencia(){
    this.servicioVerificacion.obtenerOpcionesCumplimiento().subscribe({
      next: (opciones)=>{
        this.opcionesCumplimiento = opciones
      },
      error: ()=>{
        this.popup.abrirPopupFallido(
          DialogosEncuestas.ERROR_OPCIONES_CUMPLIMIENTO_TITULO, 
          DialogosEncuestas.ERROR_OPCIONES_CUMPLIMIENTO_DESCRIPCION
        )
      }
    })
    this.servicioVerificacion.obtenerOpcionesCorrespondencia().subscribe({
      next: (opciones)=>{
        this.opcionesCorrespondencia = opciones
      },
      error: ()=>{
        this.popup.abrirPopupFallido(
          DialogosEncuestas.ERROR_OPCIONES_CORRESPONDENCIA_TITULO,
          DialogosEncuestas.ERROR_OPCIONES_CORRESPONDENCIA_DESCRIPCION
        )
      }
    })
  }
  
  //Manejadores de eventos
  alResponderPreguntas(respuestas: any){
    this.setHayCambios(true)
  }

  alResponderVerificaciones(verificacion: any){
    this.setHayCambios(true)
  }

  manejarErrorCargaArchivo(error: HttpErrorResponse){
    this.popup.abrirPopupFallido('Error al cargar el archivo', 'Intentalo más tarde.')
  }

  manejarArchivoExcedeTamano(tamano: number){
    this.popup.abrirPopupFallido('Limite de tamaño excedido.', `El archivo debe pesar como máximo ${tamano} megabytes.`)
  }

  //Acciones
  guardarRespuestas(){
    this.servicioEncuestas.guardarRespuesta(this.idReporte, { respuestas: this.obtenerRespuestas() }).subscribe({
      next: ( respuesta ) =>{
        this.popup.abrirPopupExitoso(respuesta.mensaje)
        this.setHayCambios(false)
      },
      error: (error: HttpErrorResponse) =>{
        this.popup.abrirPopupFallido('Error', error.error.message)
      }
    })

  }

  guardarVerificaciones(){
    this.servicioVerificacion.guardarVerificaciones(this.idReporte, this.obtenerVerificaciones()).subscribe({
      next: ( respuesta: any ) =>{
        this.popup.abrirPopupExitoso('Se han guardado las verificaciones')
        this.setHayCambios(false)
      },
      error: (error: HttpErrorResponse) =>{
        this.popup.abrirPopupFallido('Error', error.error.message)
      }
    })
  }

  resaltarRespuestasInvalidas(invalidas: RespuestaInvalida[]){ //reemplazar esto por un observable
    this.clasificaciones.forEach( clasificacion =>{
      clasificacion.resaltarRespuestasInvalidas(invalidas)
    })
  }

  exportarPDF(){
    window.print()
  }

  setHayCambios(hayCambios: boolean){
    this.hayCambios = hayCambios
    this.hanHabidoCambios.emit(hayCambios)
  }
}
