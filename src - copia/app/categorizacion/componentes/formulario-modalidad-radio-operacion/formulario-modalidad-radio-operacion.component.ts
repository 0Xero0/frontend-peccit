import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ModalidadRadio, ModalidadRadioFila } from '../../modelos/Categorizacion';
import { Modalidad } from '../../modelos/Modalidad';
import { Radio } from '../../modelos/Radio';
import { CategorizacionService } from '../../servicios/categorizacion.service';
import { ModalidadRadioACrear } from '../../modelos/ModalidadRadioACrear';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { marcarFormularioComoSucio } from 'src/app/administrador/utilidades/Utilidades';

@Component({
  selector: 'app-formulario-modalidad-radio-operacion',
  templateUrl: './formulario-modalidad-radio-operacion.component.html',
  styleUrls: ['./formulario-modalidad-radio-operacion.component.css']
})
export class FormularioModalidadRadioOperacionComponent implements OnInit {
  @Output('aCrear') aCrear                : EventEmitter<ModalidadRadioACrear[]>
  @Output('aEliminar') aEliminar          : EventEmitter<number[]>
  @Output('haCambiadoDebePresentarPesv') haCambiadoDebePresentarPesv: EventEmitter<boolean>

  @Input('modalidadRadio') modalidadRadio!: ModalidadRadio

  formulario        : FormGroup
  modalidades       : Modalidad[] = []
  radios            : Radio[] = []
  idRadiosNoObligadosAPresentarPesv: number[] = [ 1, 2, 3 ]
  nombresRadiosNoObligadosAPresentarPesv: string[] = [ 'MUNICIPAL', 'DISTRITAL', 'METROPOLITANO' ]
  registrosACrear   : ModalidadRadioACrear[] = []
  registrosAEliminar: number[] = []
  formularioVisible : boolean = false
  valido            : boolean = true
  debePresentarPesv : boolean = true

  constructor(private servicioCategorizacion: CategorizacionService){
    this.haCambiadoDebePresentarPesv = new EventEmitter<boolean>();
    this.aCrear = new EventEmitter<ModalidadRadioACrear[]>();
    this.aEliminar = new EventEmitter<number[]>();

    this.formulario = new FormGroup({
      idModalidad: new FormControl<number | string>("", [Validators.required]), 
      idRadio: new FormControl<number | string>("", [Validators.required]) 
    })
  }

  ngOnInit(): void {
    this.obtenerModalidades()
    this.valido = this.esValido()
    this.evaluarDebePresentarPesv()
    this.formulario.get('idModalidad')!.valueChanges.subscribe({
      next: (valor) =>{
        this.formulario.get('idRadio')!.setValue("")
        this.obtenerRadios(valor)
        this.formulario.markAsPristine()
      }
    })
  }

  mostrarFormulario(){
    this.formularioVisible = true
  }

  ocultarFormulario(){
    this.formularioVisible = false
  }

  agregarARam(){
    if(this.formulario.invalid){
      marcarFormularioComoSucio(this.formulario)
      return;
    }
    const idRadio = this.formulario.get('idRadio')!
    const idModalidad = this.formulario.get('idModalidad')!
    const modalidadRadio: ModalidadRadioACrear = {
      idModalidad: Number(idModalidad.value),
      idRadio: Number(idRadio.value)
    }
    this.registrosACrear.push(modalidadRadio)
    this.ocultarFormulario()
    this.mostrarMensajeDeGuardado()
    this.valido = this.esValido()
    this.evaluarDebePresentarPesv()
    this.limpiarFormulario()
  }

  retirarDeRam(indice: number){
    this.registrosACrear.splice(indice, 1)
    this.mostrarMensajeDeGuardado()
    this.valido = this.esValido()
    this.evaluarDebePresentarPesv()
  }

  
  eliminarRegistro(id: number){
    this.registrosAEliminar.push(id)
    this.mostrarMensajeDeGuardado()
    this.valido = this.esValido()
    this.evaluarDebePresentarPesv()
  }

  cancelarEliminacionRegistro(id: number){
    const indice = this.registrosAEliminar.findIndex( idEnArreglo => idEnArreglo === id)
    this.registrosAEliminar.splice(indice, 1)
    this.valido = this.esValido()
    this.evaluarDebePresentarPesv()
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
    if(this.registrosAEliminar.length < this.modalidadRadio.filas.length){
      return true
    }
    return false
  }

  evaluarDebePresentarPesv(): void{
    const idRegistrosQueObliganAPresentarPesv = this.obtenerIdRegistrosQueObliganAPresentarPesv()
    for (const idRegistroQueObligaAPresentarPesv of idRegistrosQueObliganAPresentarPesv) {
      if(!this.registrosAEliminar.includes(idRegistroQueObligaAPresentarPesv)){
        this.setDebePresentarPesv(true)
        return;
      }
    }
    for(const registroACrear of this.registrosACrear){
      if(!this.idRadiosNoObligadosAPresentarPesv.includes(registroACrear.idRadio!)){
        this.setDebePresentarPesv(true)
        return;
      }
    }
    this.setDebePresentarPesv(false)
  }

  private obtenerIdRegistrosQueObliganAPresentarPesv(): number[]{ // evalua solo los registros en base de datos
    const idRegistrosQueObliganAPresentarPesv: number[] = [] 
    this.modalidadRadio.filas.forEach( fila => { 
      if(!this.nombresRadiosNoObligadosAPresentarPesv.includes(fila.radio)){
        idRegistrosQueObliganAPresentarPesv.push(fila.id)
      }
    })
    return idRegistrosQueObliganAPresentarPesv
  }

  evaluarModalidadRadioPresentarPesv(modalidadRadio: ModalidadRadioACrear){
    if(!this.idRadiosNoObligadosAPresentarPesv.includes(modalidadRadio.idRadio!)){
      return true
    }
    return false
  }

  emitirDebePresentarPesv(debePresentarPesv: boolean){
    this.haCambiadoDebePresentarPesv.emit(debePresentarPesv)
  }

  setDebePresentarPesv(debePresentarPesv: boolean){
    this.debePresentarPesv = debePresentarPesv
    this.emitirDebePresentarPesv(debePresentarPesv)
  }
}
