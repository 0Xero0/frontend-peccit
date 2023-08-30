import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { marcarFormularioComoSucio } from 'src/app/administrador/utilidades/Utilidades';
import { ModalidadRadio } from 'src/app/categorizacion/modelos/Categorizacion';
import { Modalidad } from 'src/app/categorizacion/modelos/Modalidad';
import { ModalidadRadioACrear } from 'src/app/categorizacion/modelos/ModalidadRadioACrear';
import { Radio } from 'src/app/categorizacion/modelos/Radio';
import { CategorizacionService } from 'src/app/categorizacion/servicios/categorizacion.service';
import { Objetivo } from '../../modelos/Objetivo';
import { ObjetivoACrear } from '../../modelos/ObjetivoACrear';

@Component({
  selector: 'app-tabla-objetivos',
  templateUrl: './tabla-objetivos.component.html',
  styleUrls: ['./tabla-objetivos.component.css']
})
export class TablaObjetivosComponent implements OnInit {
  @Output('aCrear') aCrear                : EventEmitter<Objetivo[]>
  @Output('aEliminar') aEliminar          : EventEmitter<number[]>

  @Input('objetivos') objetivos: Objetivo[] = []

  formulario        : FormGroup
  modalidades       : Modalidad[] = []
  radios            : Radio[] = []
  idRadiosNoObligadosAPresentarPesv: number[] = [ 1, 2, 3 ]
  nombresRadiosNoObligadosAPresentarPesv: string[] = [ 'MUNICIPAL', 'DISTRITAL', 'METROPOLITANO' ]
  registrosACrear   : ObjetivoACrear[] = []
  registrosAEliminar: number[] = []
  formularioVisible : boolean = false
  valido            : boolean = true
  debePresentarPesv : boolean = true

  constructor(private servicioCategorizacion: CategorizacionService){
    this.aCrear = new EventEmitter<Objetivo[]>();
    this.aEliminar = new EventEmitter<number[]>();

    this.formulario = new FormGroup({
      objetivo: new FormControl<string>("", [Validators.required]), 
    })
  }

  ngOnInit(): void {
    this.obtenerModalidades()
    this.valido = this.esValido()
/*     this.formulario.get('modalidad')!.valueChanges.subscribe({
      next: (valor) =>{
        this.formulario.get('idRadio')!.setValue("")
        this.obtenerRadios(valor)
        this.formulario.markAsPristine()
      }
    })
 */  }

  mostrarFormulario(){
    this.formularioVisible = true
  }

  ocultarFormulario(){
    this.formularioVisible = false
  }

  agregarARam(): void{
    if(this.formulario.invalid){
      marcarFormularioComoSucio(this.formulario)
      return;
    }
    const inputObjetivo = this.formulario.get('objetivo')!
    const objetivo: ObjetivoACrear = {
      nombre: inputObjetivo.value
    }
    this.registrosACrear.push(objetivo)
    this.ocultarFormulario()
    this.mostrarMensajeDeGuardado()
    this.valido = this.esValido()
    this.limpiarFormulario()
  }

  retirarDeRam(indice: number){
    this.registrosACrear.splice(indice, 1)
    this.mostrarMensajeDeGuardado()
    this.valido = this.esValido()
  }

  
  eliminarRegistro(id: number){
    this.registrosAEliminar.push(id)
    this.mostrarMensajeDeGuardado()
    this.valido = this.esValido()
  }

  cancelarEliminacionRegistro(id: number){
    const indice = this.registrosAEliminar.findIndex( idEnArreglo => idEnArreglo === id)
    this.registrosAEliminar.splice(indice, 1)
    this.valido = this.esValido()
  }

  limpiarFormulario(){
    this.formulario.reset()
    this.formulario.get('idRadio')!.setValue('')
    this.formulario.get('idModalidad')!.setValue('')
  }

  obtenerModalidades(){
    this.servicioCategorizacion.obtenerModalidades().subscribe({
      next: (respuesta) => {
        this.modalidades = respuesta.modalidades
      }
    })
  }

  obtenerRadios(idModalidad: number){
    this.servicioCategorizacion.obtenerRadios(idModalidad).subscribe({
      next: (respuesta) => {
        this.radios = respuesta.radios
      }
    })
  }

  esRegistroAEliminar(id: number): boolean{
    return this.registrosAEliminar.includes(id)
  }

  nombreModalidad(idModalidad: number): string{
    const indice = this.modalidades.findIndex( modalidad => modalidad.id === idModalidad)
    if(indice !== -1){
      return this.modalidades[indice].nombre
    }
    return '-'
  }

  nombreRadio(idRadio: number): string{
    const indice = this.radios.findIndex( radio => radio.id === idRadio)
    if(indice !== -1){
      return this.radios[indice].nombre
    }
    return '-'
  }

  mostrarMensajeDeGuardado(){
    return this.registrosACrear.length > 0 || this.registrosAEliminar.length > 0 ? true : false;
  }

  estaAgregandoModuloRadio(): boolean{
    return this.formularioVisible
  }

  esValido(){
    if(this.registrosACrear.length > 0){
      return true 
    }
    if(this.registrosAEliminar.length < this.objetivos.length){
      return true
    }
    return false
  }

}
