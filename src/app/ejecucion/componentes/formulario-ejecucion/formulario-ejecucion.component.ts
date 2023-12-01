import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormularioEjecucion } from '../../modelos/FormularioEjecucion';
import { RespuestaActividad } from '../../modelos/RespuestaActividad';
import { RespuestaAdicional } from '../../modelos/RespuestaAdicional';
import { ServicioEjecucion } from '../../servicios/ejecucion.service';
import { PopupComponent } from 'src/app/alertas/componentes/popup/popup.component';
import { DialogosEjecucion } from '../../DialogosEjecucion';
import { HttpErrorResponse } from '@angular/common/http';
import { Mes } from 'src/app/encuestas/modelos/Mes';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/autenticacion/modelos/IniciarSesionRespuesta';
import { ServicioLocalStorage } from 'src/app/administrador/servicios/local-storage.service';
import { ErrorAutorizacion } from 'src/app/errores/ErrorAutorizacion';
import { ImportarPatiosComponent } from '../importar-patios/importar-patios.component';
import { ImportarEmpresasComponent } from '../importar-empresas/importar-empresas.component';
import { TipoImportacion } from '../../TipoImportacion';
import { RespuestaErrorImportacion } from '../../modelos/ErrorImportacion';
import { Observable, catchError, forkJoin, observable, of } from 'rxjs'

@Component({
  selector: 'app-formulario-ejecucion',
  templateUrl: './formulario-ejecucion.component.html',
  styleUrls: ['./formulario-ejecucion.component.css']
})
export class FormularioEjecucionComponent implements OnInit, OnChanges{
  @ViewChild('popup') popup!: PopupComponent
  @ViewChild('importarPatios') importarPatios!: ImportarPatiosComponent
  @ViewChild('importarEmpresas') importarEmpresas!: ImportarEmpresasComponent
  @Output() recargar: EventEmitter<void>
  @Output() cambioDeMes: EventEmitter<number>
  @Output() formularioGuardado: EventEmitter<void>

  @Input() formulario!: FormularioEjecucion
  @Input() historico: boolean = false
  @Input() esVigilado: boolean = true
  @Input() meses: Mes[] = []
  @Input() idMesInicial!: number
  
  actividadesFaltantes: number[] = []
  adicionalesFaltantes: number[] = []

  respuestasActividades: RespuestaActividad[] = []
  respuestasAdicionales: RespuestaAdicional[] = []
  hayCambios: boolean = false
  idMes?: number;
  usuario: Usuario
  colaDeMensajes: ((param: Function) => void)[] = []

  constructor(private servicio: ServicioEjecucion, private router: Router, private servicioLocalStorage: ServicioLocalStorage){
    const usuario = this.servicioLocalStorage.obtenerUsuario()
    if(!usuario) throw new ErrorAutorizacion();
    this.usuario = usuario
    this.cambioDeMes = new EventEmitter<number>();
    this.formularioGuardado = new EventEmitter<void>();
    this.recargar = new EventEmitter<void>();
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if(changes['idMesInicial']){
      this.idMes = changes['idMesInicial'].currentValue
    }
  }

  ngOnInit(): void {
    this.idMes = this.idMesInicial
  }

  guardar(){
    const archivoPatios = this.importarPatios.archivoACargar
    const archivoEmpresas = this.importarEmpresas.archivoACargar
    forkJoin(
      {
        guardarFormulario: this.guardarFormulario(),
        importarPatios: archivoPatios ? this.guardarImportacion(archivoPatios, TipoImportacion.PATIOS) : this.observableNulo(),
        importarEmpresas: archivoEmpresas ? this.guardarImportacion(archivoEmpresas, TipoImportacion.EMPRESAS) : this.observableNulo()
      }
    ).subscribe({
      next: (respuestas)=>{
        if(respuestas.importarEmpresas instanceof HttpErrorResponse || respuestas.importarPatios instanceof HttpErrorResponse){
          const respuestaImportarEmpresas = respuestas.importarEmpresas
          const respuestaImportarPatios = respuestas.importarPatios
          this.agregarMensajeALaCola((siguiente)=>{
            this.popup.abrir({
              icono: 'advertencia',
              titulo: 'Formulario guardado con errores',
              texto: 'A continuación el detalle de los errores',
              alCerrar: ()=>{ siguiente() }
            })
          })
          if(respuestaImportarEmpresas instanceof HttpErrorResponse){
            if(respuestaImportarEmpresas.status === 422){
              const respuesta = respuestaImportarEmpresas.error as RespuestaErrorImportacion
              this.agregarMensajeALaCola((siguiente)=>{
                this.importarEmpresas.abrirModalErrores(respuesta.errores, respuesta.archivo, siguiente)
              })
            }
          }
          if(respuestaImportarPatios instanceof HttpErrorResponse){
            if(respuestaImportarPatios.status === 422){
              const respuesta = respuestaImportarPatios.error as RespuestaErrorImportacion
              this.agregarMensajeALaCola((siguiente)=>{
                this.importarPatios.abrirModalErrores(respuesta.errores, respuesta.archivo, siguiente)
              })
            }
          }
          this.mostrarMensajeDeLaCola()
        }else{
          this.popup.abrir({
            icono: 'exitoso',
            titulo: 'Formulario guardado con éxito',
          })
        }
      },
      error: (e)=>{
        this.popup.abrir({
          icono: 'error',
          titulo: 'Error',
          texto: 'Vuelve a intentarlo más tarde'
        })
      }
    })

/*     this.servicio.guardarEjecucion(
      +this.formulario.idReporte,
      this.idMes!, 
      this.respuestasActividades, 
      this.respuestasAdicionales,
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
    }) */
    this.importarPatios.refrescar()
    this.importarEmpresas.refrescar()
  }

  guardarFormulario(): Observable<Object>{
    return this.servicio.guardarEjecucion(
      +this.formulario.idReporte,
      this.idMes!, 
      this.respuestasActividades, 
      this.respuestasAdicionales,
    )
  }

  observableNulo(): Observable<null>{
    return new Observable( sub => {
      sub.next(null);
      sub.complete();
    })
  }

  enviar(){
    this.servicio.enviarEjecucion(+this.formulario.idReporte, this.formulario.idVigilado, this.idMes!).subscribe({
      next: ()=>{
        this.popup.abrirPopupExitoso(DialogosEjecucion.ENVIAR_EJECUCION_EXITO)
        this.recargar.emit()
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

  guardarImportacion(archivo: File, tipo: TipoImportacion): Observable<Object | HttpErrorResponse>{
    return this.servicio.guardarImportacion(
      archivo, 
      this.formulario.idVigilado, 
      this.formulario.vigencia,
      this.formulario.mes,
      tipo
    ).pipe(
      catchError((error) =>{
        return of(error)
      })
    )/* .subscribe({
      next: ()=>{},
      error: (error: HttpErrorResponse)=>{
        if(error.status === 422){
          const respuesta = error.error as RespuestaErrorImportacion
          if(tipo === TipoImportacion.EMPRESAS){
            this.importarEmpresas.abrirModalErrores(respuesta.errores, respuesta.archivo)
          }
          if(tipo === TipoImportacion.PATIOS){
            this.importarPatios.abrirModalErrores(respuesta.errores, respuesta.archivo)
          }
        }else{
          this.popup.abrirPopupFallido("Error al importar", "Intentalo más tarde.")
        }
      }
    }) */
  }

  manejarCambioArchivos(){
    this.hayCambios = true
  }

  mostrarMensajeDeLaCola = ()=>{
    if(this.colaDeMensajes.length > 0){
      const mensaje = this.colaDeMensajes.shift()!
      mensaje(this.mostrarMensajeDeLaCola)
    }
  }

  agregarMensajeALaCola(enunciado: (param: Function) => void){
    this.colaDeMensajes.push(enunciado)
  }
}
