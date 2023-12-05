import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Patio } from 'src/app/informacion-general/modelos/Patio';
import { ServicioEjecucion } from '../../servicios/ejecucion.service';
import { ServicioArchivos } from 'src/app/archivos/servicios/archivos.service';
import { environment } from 'src/environments/environment';
import { ErrorImportacion, RespuestaErrorImportacion } from '../../modelos/ErrorImportacion';
import { TipoImportacion } from '../../TipoImportacion';
import { HttpErrorResponse } from '@angular/common/http';
import { PopupComponent } from 'src/app/alertas/componentes/popup/popup.component';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Importacion } from '../../modelos/EventoCambioArchivoImportacion';

@Component({
  selector: 'app-importar-patios',
  templateUrl: './importar-patios.component.html',
  styleUrls: ['./importar-patios.component.css']
})
export class ImportarPatiosComponent implements OnInit {
  @ViewChild('modalErrores') modalErrores!: ElementRef
  @ViewChild('popup') popup!: PopupComponent
  @Output() hayCambios: EventEmitter<Importacion>
  @Input() vigencia!: number
  @Input() idMes!: number
  @Input() idVigilado!: string

  patios: Patio[] = []
  visible: boolean = true
  plantilla?: string
  archivoCargado?: string
  archivoACargar: File | null = null
  erroresValidacion: ErrorImportacion[] = []
  instanciaModalErrores?: NgbModalRef
  archivoErrores?: string
  mensaje: string = ""

  constructor(
    private servicio: ServicioEjecucion, 
    private servicioArchivos: ServicioArchivos,
    private servicioModal: NgbModal){
    this.hayCambios = new EventEmitter<Importacion>();
  }

  ngOnInit(): void {
    this.obtenerListadoPatios(this.idVigilado, this.vigencia, this.idMes)
  }

  obtenerListadoPatios(idVigilado: string, vigencia: number, idMes: number){
    this.servicio.consultarListadoPatios(idVigilado, vigencia, idMes).subscribe({
      next: (listado)=>{
        this.patios = listado.patios
        this.plantilla = listado.plantilla
        this.archivoCargado = listado.cargados
        this.visible = listado.visible
        this.mensaje = listado.mensaje
      }
    })
  }

  descargarArchivo(endpoint: string){
    this.servicioArchivos.descargarArchivoUrl(endpoint)
  }

  descargarArchivoUrl(endpoint: string){
    window.open(`${environment.urlBackend}/api/v1${endpoint}`)
  }

  manejarCambiosArchivo(archivo: File | null){
    this.hayCambios.emit({
      archivo: archivo,
      idMes: this.idMes,
      idVigilado: this.idVigilado,
      vigencia: this.vigencia,
      tipo: TipoImportacion.EMPRESAS
    })
  }

  descargarCSVErrores(){
    if(this.archivoErrores){
      this.servicioArchivos.descargarBase64(this.archivoErrores, 'errores.csv')
    }
  }

  abrirModalErrores(errores: ErrorImportacion[], archivoErrores: string, alCerrar?: Function){
    this.erroresValidacion = errores
    this.archivoErrores = archivoErrores
    this.instanciaModalErrores = this.servicioModal.open(this.modalErrores, {
      size: 'md',
      centered: true,
      beforeDismiss: ()=>{
        console.log(alCerrar)
        if(alCerrar) alCerrar();
        return true
      }
    })
  }
  
  cerrarModalErrores(){
    this.instanciaModalErrores!.dismiss()
  }

  refrescar(){
    this.archivoACargar = null
    this.plantilla = undefined
    this.archivoCargado = undefined
    this.patios = []
    this.obtenerListadoPatios(this.idVigilado, this.vigencia, this.idMes)
  }
}
