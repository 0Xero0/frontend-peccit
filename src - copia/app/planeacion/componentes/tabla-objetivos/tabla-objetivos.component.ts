import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { marcarFormularioComoSucio } from 'src/app/administrador/utilidades/Utilidades';
import { CategorizacionService } from 'src/app/categorizacion/servicios/categorizacion.service';
import { Objetivo } from '../../modelos/Objetivo';
import { ObjetivoACrear } from '../../modelos/ObjetivoACrear';

@Component({
  selector: 'app-tabla-objetivos',
  templateUrl: './tabla-objetivos.component.html',
  styleUrls: ['./tabla-objetivos.component.css']
})
export class TablaObjetivosComponent implements OnInit {
  @Output('aCrear') aCrear                : EventEmitter<string[]>
  @Output('aEliminar') aEliminar          : EventEmitter<number[]>
  @Output() nuevosObjetivos: EventEmitter<string[]>

  @Input() objetivos: Objetivo[] = []
  @Input() soloLectura: boolean = false
  @Input() objetivosRequeridos = false

  formulario        : FormGroup
  registrosACrear   : ObjetivoACrear[] = []
  registrosAEliminar: number[] = []
  formularioVisible : boolean = false
  valido            : boolean = true
  debePresentarPesv : boolean = true

  constructor(private servicioCategorizacion: CategorizacionService){
    this.aCrear = new EventEmitter<string[]>();
    this.aEliminar = new EventEmitter<number[]>();
    this.nuevosObjetivos = new EventEmitter<string[]>();

    this.formulario = new FormGroup({
      objetivo: new FormControl<string>("", [Validators.required]), 
    })
  }

  ngOnInit(): void {
    this.valido = this.esValido()
  }

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
    this.nuevosObjetivos.emit( this.obtenerObjetivosAGuardar() )
  }

  retirarDeRam(indice: number){
    this.registrosACrear.splice(indice, 1)
    this.mostrarMensajeDeGuardado()
    this.valido = this.esValido()
    this.nuevosObjetivos.emit( this.obtenerObjetivosAGuardar() )

  }

  
  eliminarRegistro(id: number){
    this.registrosAEliminar.push(id)
    this.mostrarMensajeDeGuardado()
    this.valido = this.esValido()
    this.nuevosObjetivos.emit( this.obtenerObjetivosAGuardar() )
  }

  cancelarEliminacionRegistro(id: number){
    const indice = this.registrosAEliminar.findIndex( idEnArreglo => idEnArreglo === id)
    this.registrosAEliminar.splice(indice, 1)
    this.valido = this.esValido()
    this.nuevosObjetivos.emit( this.obtenerObjetivosAGuardar() )
  }

  limpiarFormulario(){
    this.formulario.reset()
    this.formulario.get('objetivo')!.setValue('')
  }

  esRegistroAEliminar(id: number): boolean{
    return this.registrosAEliminar.includes(id)
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

  obtenerObjetivosAGuardar(): string[]{
    let objetivosACrear: string[] = []
    let objetivosAMantener: string[] = []
    objetivosACrear = this.registrosACrear.map( registroACrear => registroACrear.nombre )
    objetivosAMantener = this.objetivos.filter(objetivo =>  !this.registrosAEliminar.includes(objetivo.id) )
    .map(objetivo => objetivo.nombre)
    return [
      ...objetivosACrear, 
      ...objetivosAMantener
    ]
  }

}
