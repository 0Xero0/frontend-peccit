import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PatioACrear } from '../../modelos/PatioACrear';
import { Patio } from '../../modelos/Patio';
import { Departamento } from 'src/app/encuestas/modelos/Departamento';
import { Ciudad } from 'src/app/encuestas/modelos/Ciudad';
import { ServicioDepartamentos } from 'src/app/encuestas/servicios/departamentos.service';
import { marcarFormularioComoSucio } from 'src/app/administrador/utilidades/Utilidades';

@Component({
  selector: 'app-tabla-patios',
  templateUrl: './tabla-patios.component.html',
  styleUrls: ['./tabla-patios.component.css']
})
export class TablaPatiosComponent {
  @Output('aCrear') aCrear                : EventEmitter<PatioACrear[]>
  @Output('aEliminar') aEliminar          : EventEmitter<number[]>

  @Input() patios: Patio[] = []
  @Input() idVigilado!: string
  @Input() patioRequerido: boolean = false
  @Input() soloLectura: boolean = false

  formulario        : FormGroup
  registrosACrear   : PatioACrear[] = []
  registrosAEliminar: number[] = [] //indice de la sede
  formularioVisible : boolean = false
  valido            : boolean = true
  debePresentarPesv : boolean = true
  departamentos: Departamento[] = []
  ciudades: Ciudad[] = []
  todasLasCiudades: Ciudad[] = []

  constructor(private servicioDepartamento: ServicioDepartamentos){
    this.aCrear = new EventEmitter<PatioACrear[]>();
    this.aEliminar = new EventEmitter<number[]>();

    this.formulario = new FormGroup({
      nombre: new FormControl<string>("", [Validators.required]), 
      departamento: new FormControl<string>("", [Validators.required]), 
      municipio: new FormControl<string>("", [Validators.required]),
      direccion: new FormControl<string>("", [Validators.required]),
      encargado: new FormControl<string>("", [Validators.required]),
      telefonoEncargado: new FormControl<string>("", [Validators.required]),
      correoEncargado: new FormControl<string>("", [Validators.required]),
    })
  }

  ngOnInit(): void {
    this.obtenerTodasLasCiudades()
    this.obtenerDepartamentos()
    this.formulario.get('departamento')!.valueChanges.subscribe({
      next: (departamentoId)=>{
        this.formulario.get('municipio')!.setValue("")
        this.obtenerCiudades(departamentoId)
      }
    })
    this.valido = this.esValido()
  }

  mostrarFormulario(){
    this.formularioVisible = true
  }

  ocultarFormulario(){
    this.formularioVisible = false
    this.limpiarFormulario()
  }

  agregarARam(): void{
    if(this.formulario.invalid){
      marcarFormularioComoSucio(this.formulario)
      return;
    }
    const inputNombre = this.formulario.get('nombre')!
    const inputDepartamento = this.formulario.get('departamento')!
    const inputMunicipio = this.formulario.get('municipio')!
    const inputDireccion = this.formulario.get('direccion')!
    const inputEncargado = this.formulario.get('encargado')!
    const inputTelefonoEncargado = this.formulario.get('telefonoEncargado')!
    const inputCorreoEncargado = this.formulario.get('correoEncargado')!

    const patio: PatioACrear = {
      nombre: inputNombre.value,
      departamento: inputDepartamento.value,
      municipio: inputMunicipio.value,
      correo: inputCorreoEncargado.value,
      direccion: inputDireccion.value,
      encargado: inputEncargado.value,
      estado: true,
      telefono: inputTelefonoEncargado.value,
      usuario_id: this.idVigilado
    }

    this.registrosACrear.push(patio)
    this.ocultarFormulario()
    this.mostrarMensajeDeGuardado()
    this.valido = this.esValido()
    this.limpiarFormulario()
    this.aCrear.emit( this.registrosACrear )
  }

  retirarDeRam(indice: number){
    this.registrosACrear.splice(indice, 1)
    this.mostrarMensajeDeGuardado()
    this.valido = this.esValido()
    this.limpiarFormulario();
    this.aCrear.emit( this.registrosACrear )
  }

  
  eliminarRegistro(idPatio: number){
    this.registrosAEliminar.push(idPatio)
    this.mostrarMensajeDeGuardado()
    this.valido = this.esValido()
    this.aEliminar.emit( this.registrosAEliminar )
  }

  cancelarEliminacionRegistro(idPatio: number){
    this.registrosAEliminar = this.registrosAEliminar.filter( idPatioEliminar => !(idPatio === idPatioEliminar) )
    this.valido = this.esValido()
    this.aEliminar.emit( this.registrosAEliminar )
  }

  limpiarFormulario(){
    this.formulario.reset()
    this.formulario.get('nombre')!.setValue('')
    this.formulario.get('departamento')!.setValue('')
    this.formulario.get('municipio')!.setValue('')
  }

  limpiarRegistrosEnRam(){
    this.registrosACrear = []
    this.registrosAEliminar = []
  }

  esRegistroAEliminar(idPatio: number): boolean{
    return this.registrosAEliminar.includes(idPatio)
  }

  mostrarMensajeDeGuardado(){
    return this.registrosACrear.length > 0 || this.registrosAEliminar.length > 0 ? true : false;
  }

  estaAgregandoSede(): boolean{
    return this.formularioVisible
  }

  esValido(){
    if(this.registrosACrear.length > 0){
      return true 
    }
    if(this.registrosAEliminar.length < this.patios.length){
      return true
    }
    return false
  }

  obtenerDepartamentos(){
    this.servicioDepartamento.obtenerDepartamentos().subscribe({
      next: (departamentos)=>{
        this.departamentos = departamentos
      }
    })
  }

  obtenerCiudades(departamentoId: number){
    this.servicioDepartamento.obtenerCiudades(departamentoId).subscribe({
      next: (ciudades)=>{
        this.ciudades = ciudades
      }
    })
  }

  obtenerTodasLasCiudades(){
    this.servicioDepartamento.obtenerTodasLasCiudades().subscribe({
      next: (ciudades)=>{
        this.todasLasCiudades = ciudades
      }
    })
  }

  obtenerNombreCiudad(idCiudad: string | number): string{
    const ciudad = this.todasLasCiudades.find(ciudad => ciudad.id == idCiudad)
    return ciudad ? ciudad.name : idCiudad.toString()
  }

  obtenerNombreDepartamento(idDepartamento: string | number): string{
    const departamento = this.departamentos.find(departamento => departamento.id == idDepartamento)
    return departamento ? departamento.name : idDepartamento.toString()
  }
}
