import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ServicioEjecucion } from '../../servicios/ejecucion.service';
import { EmpresaJurisdiccion } from 'src/app/informacion-general/modelos/EmpresaJurisdiccion';
import { ServicioArchivos } from 'src/app/archivos/servicios/archivos.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-importar-empresas',
  templateUrl: './importar-empresas.component.html',
  styleUrls: ['./importar-empresas.component.css']
})
export class ImportarEmpresasComponent implements OnInit{
  @Output() hayCambios: EventEmitter<void>
  @Input() vigencia!: number
  @Input() idMes!: number
  @Input() idVigilado!: string

  empresas: EmpresaJurisdiccion[] = []
  plantilla?: string
  archivoCargado?: string
  archivoACargar: File | null = null

  constructor(private servicio: ServicioEjecucion, private servicioArchivos: ServicioArchivos){
    this.hayCambios = new EventEmitter<void>();
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

  manejarCambiosArchivo(){
    this.hayCambios.emit()
  }

  refrescar(){
    this.archivoACargar = null
    this.plantilla = undefined
    this.archivoCargado = undefined
    this.empresas = []
    this.obtenerListadoEmpresas(this.idVigilado, this.vigencia, this.idMes)
  }
}
