import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RespuestaAdicional } from '../../modelos/RespuestaAdicional';
import { Adicional } from '../../modelos/FormularioEjecucion';
import { ServicioArchivos } from 'src/app/archivos/servicios/archivos.service';

@Component({
  selector: 'app-adicional-form-ejec',
  templateUrl: './adicional-form-ejec.component.html',
  styleUrls: ['./adicional-form-ejec.component.css']
})
export class AdicionalFormEjecComponent {
  @Output() nuevoAdicional: EventEmitter<RespuestaAdicional>
  @Input() adicional!: Adicional
  @Input() idVigilado!: string
  @Input() soloLectura: boolean = false

  respuesta: string = ""
  evidencia: File | null = null
  observacion: string = ""

  respuestaAdicional?: RespuestaAdicional

  constructor(private servicioArchivo: ServicioArchivos){
    this.nuevoAdicional = new EventEmitter<RespuestaAdicional>();
  }

  ngOnInit(): void {
    this.observacion = this.adicional.observacion
    this.respuesta = this.adicional.respuesta
    this.respuestaAdicional = {
      adicionalId: this.adicional.idAdicional,
      documento: "",
      nombreArchivo: "",
      ruta: "",
      valor: this.respuesta,
      observacion: this.observacion
    }
    //console.log(this.respuesta)
  }

  manejarCambioArchivo(archivo: File | null){
    console.log(archivo)
    this.setEvidencia(archivo)
  }

  manejarCambioObservacion(observacion: string){
    this.setObservacion(observacion)
  }

  manejarCambioRespuesta(respuesta: string){
    this.setRespuesta(respuesta)
  }

  deshabilitarEvidencia():boolean{
    if(this.adicional.idAdicional === 58 && this.respuesta === "N"){
      return true;
    }
    return false;
  }

  esObservacionNumerica(): boolean{
    const opcion = this.adicional.valoresPregunta!.find( valorPregunta => valorPregunta.valor === this.respuesta )
    return opcion && opcion.tipo === 'N' ? true : false
  }

  setRespuesta(valor: string, emitir: boolean = true){
    this.respuesta = valor
    if(!this.adicional.habilitaObservacion!.includes(valor)) this.setObservacion("", false);
    if(this.respuestaAdicional) this.respuestaAdicional.valor = valor;
    if(emitir) this.nuevoAdicional.emit(this.respuestaAdicional);
  }

  setObservacion(observacion: string, emitir: boolean = true){
    this.observacion = observacion
    if(this.respuestaAdicional) this.respuestaAdicional.observacion = observacion;
    if(emitir) this.nuevoAdicional.emit(this.respuestaAdicional);
  }

  setEvidencia(archivo: File | null, emitir: boolean = true){
    if(archivo){
      this.servicioArchivo.guardarArchivo(archivo, 'peccit', this.idVigilado).subscribe({
        next: (respuesta)=>{
          this.respuestaAdicional = {
            adicionalId: this.adicional.idAdicional,
            documento: respuesta.nombreAlmacenado,
            nombreArchivo: respuesta.nombreOriginalArchivo,
            ruta: respuesta.ruta,
            valor: this.respuesta,
            observacion: this.observacion
          }
          if(emitir) this.nuevoAdicional.emit(this.respuestaAdicional);
        }
      })
    }else{
      this.respuestaAdicional = {
        adicionalId: this.adicional.idAdicional,
        documento: "",
        nombreArchivo: "",
        ruta: "",
        valor: this.respuesta,
        observacion: this.observacion
      }
      if(emitir) this.nuevoAdicional.emit(this.respuestaAdicional)
    }
  }

  descargarEvidencia(){
    this.servicioArchivo.descargarArchivo(this.adicional.documento, this.adicional.ruta, this.adicional.nombreOriginal)
  }
}
