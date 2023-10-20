import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FormularioTarifa } from '../../modelos/FormularioTarifa';
import { ServicioTarifas } from '../../servicios/tarifas.service';
import { ServicioArchivos } from 'src/app/archivos/servicios/archivos.service';
import { Usuario } from 'src/app/autenticacion/modelos/IniciarSesionRespuesta';
import { ServicioLocalStorage } from 'src/app/administrador/servicios/local-storage.service';
import { ErrorAutorizacion } from 'src/app/errores/ErrorAutorizacion';
import { marcarFormularioComoSucio } from 'src/app/administrador/utilidades/Utilidades';
import { PopupComponent } from 'src/app/alertas/componentes/popup/popup.component';
import { DateTime } from 'luxon';
import { FiltrosTarifas } from '../../modelos/FiltrosTarifas';
import { Observable } from 'rxjs';
import { Paginacion } from 'src/app/compartido/modelos/Paginacion';
import { Tarifa } from '../../modelos/Tarifa';
import { Paginador } from 'src/app/administrador/modelos/compartido/Paginador';

@Component({
  selector: 'app-pagina-tarifas',
  templateUrl: './pagina-tarifas.component.html',
  styleUrls: ['./pagina-tarifas.component.css']
})
export class PaginaTarifasComponent implements OnInit{
  @ViewChild('popup') popup!: PopupComponent
  formulario: FormGroup<FormularioTarifa>
  usuario: Usuario;
  mostrarFormulario: boolean = false
  anios: number[] = []
  vigencia: number
  tarifas: Tarifa[] = []
  paginador: Paginador<FiltrosTarifas>
  tiposServicios: { nombre: string, id: number }[] = []

  constructor(
    private servicioTarifas: ServicioTarifas, 
    private servicioArchivos: ServicioArchivos, 
    private servicioLocalStorage: ServicioLocalStorage
  ) {
    const usuario = this.servicioLocalStorage.obtenerUsuario()
    if(!usuario) throw new ErrorAutorizacion();
    this.paginador = new Paginador<FiltrosTarifas>(this.obtenerTarifas)
    const anioActual = DateTime.now().year
    this.vigencia = anioActual
    this.anios = [ anioActual, anioActual - 1, anioActual - 2, anioActual - 3, anioActual - 4, anioActual -5 ]
    this.usuario = usuario
    this.formulario = new FormGroup<FormularioTarifa>({
      idServicioModalidad: new FormControl<number | null>(null, [ Validators.required ]),
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

  ngOnInit(): void {
    this.paginador.inicializar(undefined, undefined, {
      idVigilado: this.usuario.usuario,
      vigencia: this.vigencia
    })
    this.obtenerServiciosModalidades()
    this.formulario.controls.actoAdministrativo.valueChanges.subscribe({
      next: (archivo)=>{
        if(archivo){
          this.servicioArchivos.guardarArchivo(archivo, 'tarifas', this.usuario.usuario).subscribe({
            next: (respuesta)=>{
              this.formulario.controls.actoAdministrativoDocumento.setValue(respuesta.nombreAlmacenado)
              this.formulario.controls.actoAdministrativoRuta.setValue(respuesta.ruta)
              this.formulario.controls.actoAdministrativoOriginal.setValue(respuesta.nombreOriginalArchivo)
            }
          })
        }else{
          this.formulario.controls.actoAdministrativoDocumento.setValue("")
          this.formulario.controls.actoAdministrativoRuta.setValue("")
          this.formulario.controls.actoAdministrativoOriginal.setValue("")
        }
      }
    })

    this.formulario.controls.estructuraCostos.valueChanges.subscribe({
      next: (archivo)=>{
        if(archivo){
          this.servicioArchivos.guardarArchivo(archivo, 'tarifas', this.usuario.usuario).subscribe({
            next: (respuesta)=>{
              this.formulario.controls.estructuraCostosDocumento.setValue(respuesta.nombreAlmacenado)
              this.formulario.controls.estructuraCostosRuta.setValue(respuesta.ruta)
              this.formulario.controls.estructuraCostosOriginal.setValue(respuesta.nombreOriginalArchivo)
            }
          })
        }else{
          this.formulario.controls.estructuraCostosDocumento.setValue("")
          this.formulario.controls.estructuraCostosRuta.setValue("")
          this.formulario.controls.estructuraCostosOriginal.setValue("")
        }
      }
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
      idServicioModalidad: this.formulario.controls.idServicioModalidad.value!,
      idVigilado: this.usuario.usuario,
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
      idVigilado: this.usuario.usuario,
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
