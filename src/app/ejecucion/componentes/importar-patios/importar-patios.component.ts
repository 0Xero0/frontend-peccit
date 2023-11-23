import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Patio } from 'src/app/informacion-general/modelos/Patio';
import { ServicioEjecucion } from '../../servicios/ejecucion.service';
import { ServicioArchivos } from 'src/app/archivos/servicios/archivos.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-importar-patios',
  templateUrl: './importar-patios.component.html',
  styleUrls: ['./importar-patios.component.css']
})
export class ImportarPatiosComponent implements OnInit {
  @Output() hayCambios: EventEmitter<void>
  @Input() vigencia!: number
  @Input() idMes!: number
  @Input() idVigilado!: string

  patios: Patio[] = []
  plantilla?: string
  archivoCargado?: string
  archivoACargar: File | null = null

  constructor(private servicio: ServicioEjecucion, private servicioArchivos: ServicioArchivos){
    this.hayCambios = new EventEmitter<void>();
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
    this.patios = []
    this.obtenerListadoPatios(this.idVigilado, this.vigencia, this.idMes)
  }
}
