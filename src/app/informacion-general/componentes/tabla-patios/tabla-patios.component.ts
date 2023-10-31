import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PatioACrear } from '../../modelos/PatioACrear';
import { Patio } from '../../modelos/Patio';
import { Departamento } from 'src/app/encuestas/modelos/Departamento';
import { Ciudad } from 'src/app/encuestas/modelos/Ciudad';
import { ServicioDepartamentos } from 'src/app/encuestas/servicios/departamentos.service';
import { marcarFormularioComoSucio } from 'src/app/administrador/utilidades/Utilidades';
import { ServicioLocalStorage } from 'src/app/administrador/servicios/local-storage.service';
import { ErrorAutorizacion } from 'src/app/errores/ErrorAutorizacion';
import { Usuario } from 'src/app/autenticacion/modelos/IniciarSesionRespuesta';

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
  usuario: Usuario

  constructor(private servicioDepartamento: ServicioDepartamentos, private servicioLocalStorage: ServicioLocalStorage){
    const usuario = this.servicioLocalStorage.obtenerUsuario()
    if(!usuario) throw new ErrorAutorizacion();
    this.usuario = usuario
    this.aCrear = new EventEmitter<PatioACrear[]>();
    this.aEliminar = new EventEmitter<number[]>();
    this.formulario = new FormGroup({
      nombre: new FormControl<string>("", [Validators.required]), 
      departamento: new FormControl<string>("", [Validators.required]), 
      municipio: new FormControl<string>("", [Validators.required]),
      direccion: new FormControl<string>("", [Validators.required]),
      encargado: new FormControl<string>("", [Validators.required, Validators.pattern(/^[A-Za-záéíóúÁÉÍÓÚñÑüÜ\s]+$/)]),
      telefonoEncargado: new FormControl<string>("", [Validators.required, Validators.minLength(10), Validators.pattern('^[0-9]+$')]),
      correoEncargado: new FormControl<string>("", [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]),
    })
  }

  ngOnInit(): void {
    this.obtenerTodasLasCiudades()
    this.obtenerDepartamentos()
    this.obtenerCiudades(this.usuario.departamentoId)
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
    console.log(this.formulario.controls)
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
    this.obtenerDepartamentos()
    this.obtenerCiudades(this.usuario.departamentoId)
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
    this.departamentos = [{
      id: this.usuario.departamentoId,
      name: this.usuario.nombreDepartamento
    }]
    const inputDepartamento = this.formulario.controls['departamento']
    inputDepartamento.setValue(this.usuario.departamentoId)
    inputDepartamento.disable()
  }

  obtenerCiudades(departamentoId: number, filtro: boolean = false){
    this.servicioDepartamento.obtenerCiudades(departamentoId, filtro).subscribe({
      next: (ciudades)=>{
        this.ciudades = ciudades
        if(this.ciudades.length === 1){
          const inputMunicipio = this.formulario.controls['municipio']
          inputMunicipio.setValue(ciudades[0].id)
          inputMunicipio.disable()
        }
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
