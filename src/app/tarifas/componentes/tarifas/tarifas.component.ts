import { Component, Input, ViewChild } from '@angular/core';
import { ServicioTarifas } from '../../servicios/tarifas.service';
import { ServicioArchivos } from 'src/app/archivos/servicios/archivos.service';
import { FiltrosTarifas } from '../../modelos/FiltrosTarifas';
import { Paginador } from 'src/app/administrador/modelos/compartido/Paginador';
import { DateTime } from 'luxon';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FormularioTarifa } from '../../modelos/FormularioTarifa';
import { Observable } from 'rxjs';
import { Paginacion } from 'src/app/compartido/modelos/Paginacion';
import { Tarifa } from '../../modelos/Tarifa';
import { PopupComponent } from 'src/app/alertas/componentes/popup/popup.component';
import { marcarFormularioComoSucio } from 'src/app/administrador/utilidades/Utilidades';

@Component({
  selector: 'app-tarifas',
  templateUrl: './tarifas.component.html',
  styleUrls: ['./tarifas.component.css']
})
export class TarifasComponent {
  @ViewChild('popup') popup!: PopupComponent
  @Input() soloLectura: boolean = false
  @Input() idVigilado!: string
  formulario: FormGroup<FormularioTarifa>
  vigencia: number
  paginador: Paginador<FiltrosTarifas>
  anios: number[] = []
  tarifas: Tarifa[] = []
  tiposServicios: { nombre: string, id: number }[] = []
  mostrarFormulario: boolean = false

  constructor(
    private servicioTarifas: ServicioTarifas, 
    private servicioArchivos: ServicioArchivos, 
  ){
    this.paginador = new Paginador<FiltrosTarifas>(this.obtenerTarifas)
    const anioActual = DateTime.now().year
    this.vigencia = anioActual
    this.anios = [ anioActual, anioActual - 1, anioActual - 2, anioActual - 3, anioActual - 4, anioActual -5 ]
    this.formulario = new FormGroup<FormularioTarifa>({
      idServicioModalidad: new FormControl<number | string | null>("", [ Validators.required, Validators.nullValidator ]),
      tarifaAutorizada: new FormControl<number | null>(null, [ Validators.required ]),
      actoAdministrativo: new FormControl<File | null>(null, [ Validators.required ]),
      actoAdministrativoDocumento: new FormControl<string | null>(null, [ Validators.required ]),
      actoAdministrativoRuta: new FormControl<string | null>(null, [ Validators.required ]),
      actoAdministrativoOriginal: new FormControl<string | null>(null, [ Validators.required ]),
      estructuraCostos: new FormControl<File | null>(null, [ Validators.required ]),
      estructuraCostosDocumento: new FormControl<string | null>(null, [ Validators.required ]),
      estructuraCostosRuta: new FormControl<string | null>(null, [ Validators.required ]),
      estructuraCostosOriginal: new FormControl<string | null>(null, [ Validators.required ]),
    })
  }

  guardarTarifa(){
    if(this.formulario.invalid){
      marcarFormularioComoSucio(this.formulario)
      return;
    }
    this.servicioTarifas.guardarTarifa({
      actoAdministrativoDocumento: this.formulario.controls.actoAdministrativoDocumento.value!,
      actoAdministrativoOriginal: this.formulario.controls.actoAdministrativoOriginal.value!,
      actoAdministrativoRuta: this.formulario.controls.actoAdministrativoRuta.value!,
      estructuraCostosDocumento: this.formulario.controls.estructuraCostosDocumento.value!,
      estructuraCostosRuta: this.formulario.controls.estructuraCostosRuta.value!,
      estructuraCostosOriginal: this.formulario.controls.estructuraCostosOriginal.value!,
      idServicioModalidad: +this.formulario.controls.idServicioModalidad.value!,
      idVigilado: this.idVigilado,
      tarifaAutorizada: this.formulario.controls.tarifaAutorizada.value!,
      vigencia: this.vigencia!
    }).subscribe({
      next: ()=>{
        this.popup.abrirPopupExitoso('Tarifa creada.')
        this.paginador.refrescar()
        this.mostrarFormulario = false
        this.limpiarFormulario()
      },
      error: ()=>{
        this.popup.abrirPopupFallido('Ocurrió un error inesperado', 'Intentalo más tarde')
      }
    })
  }

  eliminarTarifa(idTarifa: number){
    this.servicioTarifas.eliminarTarifa(idTarifa).subscribe({
      next: ()=>{
        this.popup.abrirPopupExitoso('Tarifa eliminada.')
        this.paginador.refrescar()
      },
      error: ()=>{
        this.popup.abrirPopupFallido('Ocurrió un error inesperado.', 'Intentalo más tarde.')
      }
    })
  }

  obtenerTarifas = (pagina:number, limite: number, filtros?: FiltrosTarifas): Observable<Paginacion>=>{
    return new Observable(subscripcion => {
      this.servicioTarifas.listarTarifas(pagina, limite, filtros).subscribe({
        next: (respuesta)=>{
          this.tarifas = respuesta.datos
          subscripcion.next(respuesta.paginacion)
        }
      })
    })
  }

  limpiarFormulario(){
    this.formulario.reset()
  }

  manejarCancelarCrearTarifa(){
    this.mostrarFormulario = false
    this.limpiarFormulario()
  }

  manejarCrearTarifa(){
    this.mostrarFormulario = true
  }
  
  manejarCambioVigencia(anio: number){
    this.paginador.inicializar(undefined, undefined, {
      idVigilado: this.idVigilado,
      vigencia: anio
    })
    this.mostrarFormulario = false
    this.limpiarFormulario()
  }

  obtenerServiciosModalidades(){
    this.servicioTarifas.obtenerServiciosModalidadesEmpresa().subscribe({
      next: (respuesta)=>{
        this.tiposServicios = respuesta.serviciosModalidades
      }
    })
  }

  obtenerNombreServicioModalidad(idServicioModalidad: number){
    const tipo = this.tiposServicios.find( tipo => tipo.id === idServicioModalidad )
    return tipo ? tipo.nombre : "";
  }

  descargarDocumento(documento: string, ruta: string, nombreOriginal: string){
    this.servicioArchivos.descargarArchivo(documento, ruta, nombreOriginal)
  }

}
