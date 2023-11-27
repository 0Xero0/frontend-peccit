import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ServicioEjecucion } from '../../servicios/ejecucion.service';
import { EmpresaJurisdiccion } from 'src/app/informacion-general/modelos/EmpresaJurisdiccion';
import { ServicioArchivos } from 'src/app/archivos/servicios/archivos.service';
import { environment } from 'src/environments/environment';
import { PopupComponent } from 'src/app/alertas/componentes/popup/popup.component';
import { ErrorImportacion } from '../../modelos/ErrorImportacion';
import { HttpErrorResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TipoImportacion } from '../../TipoImportacion';
import { Importacion } from '../../modelos/EventoCambioArchivoImportacion';

@Component({
  selector: 'app-importar-empresas',
  templateUrl: './importar-empresas.component.html',
  styleUrls: ['./importar-empresas.component.css']
})
export class ImportarEmpresasComponent implements OnInit{
  @ViewChild('modalErrores') modalErrores!: ElementRef
  @ViewChild('popup') popup!: PopupComponent
  @Output() hayCambios: EventEmitter<Importacion>
  @Input() vigencia!: number
  @Input() idMes!: number
  @Input() idVigilado!: string

  empresas: EmpresaJurisdiccion[] = []
  plantilla?: string
  archivoCargado?: string
  archivoACargar: File | null = null
  erroresValidacion: ErrorImportacion[] = []
  instanciaModalErrores: any

  constructor(
    private servicio: ServicioEjecucion, 
    private servicioArchivos: ServicioArchivos,
    private servicioModal: NgbModal){
    this.hayCambios = new EventEmitter<Importacion>();
  }

  ngOnInit(): void {
    this.obtenerListadoEmpresas(this.idVigilado, this.vigencia, this.idMes)
  }

  obtenerListadoEmpresas(idVigilado: string, vigencia: number, idMes: number){
    this.servicio.consultarListadoEmpresas(idVigilado, vigencia, idMes).subscribe({
      next: (listado)=>{
        this.empresas = listado.empresas
        this.plantilla = listado.plantilla
        this.archivoCargado = listado.cargados
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

  abrirModalErrores(errores: ErrorImportacion[]){
    this.erroresValidacion = errores
    this.instanciaModalErrores = this.servicioModal.open(this.modalErrores, {
      size: 'md',
      centered: true
    })
  }

  cerrarModalErrores(){
    this.servicioModal.dismissAll()
  }

  refrescar(){
    this.archivoACargar = null
    this.plantilla = undefined
    this.archivoCargado = undefined
    this.empresas = []
    this.obtenerListadoEmpresas(this.idVigilado, this.vigencia, this.idMes)
  }
}