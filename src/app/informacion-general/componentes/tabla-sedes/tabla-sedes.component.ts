import { Component, EventEmitter, Input, Output } from '@angular/core';
import { marcarFormularioComoSucio } from 'src/app/administrador/utilidades/Utilidades';
import { Sede } from '../../modelos/Sede';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Departamento } from 'src/app/encuestas/modelos/Departamento';
import { Ciudad } from 'src/app/encuestas/modelos/Ciudad';
import { ServicioDepartamentos } from 'src/app/encuestas/servicios/departamentos.service';
import { ServicioLocalStorage } from 'src/app/administrador/servicios/local-storage.service';
import { ErrorAutorizacion } from 'src/app/errores/ErrorAutorizacion';
import { Usuario } from 'src/app/autenticacion/modelos/IniciarSesionRespuesta';

@Component({
  selector: 'app-tabla-sedes',
  templateUrl: './tabla-sedes.component.html',
  styleUrls: ['./tabla-sedes.component.css']
})
export class TablaSedesComponent {
  @Output('aCrear') aCrear                : EventEmitter<Sede>
  @Output('aEliminar') aEliminar          : EventEmitter<number[]>
  @Output() nuevasSedes: EventEmitter<Sede[]>

  @Input() sedes: Sede[] = []
  @Input() sedeRequerida: boolean = false
  @Input() soloLectura: boolean = false

  formulario        : FormGroup
  registrosACrear   : Sede[] = []
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
    this.aCrear = new EventEmitter<Sede>();
    this.aEliminar = new EventEmitter<number[]>();
    this.nuevasSedes = new EventEmitter<Sede[]>();

    this.formulario = new FormGroup({
      nombre: new FormControl<string>("", [Validators.required]), 
      departamento: new FormControl<string>("", [Validators.required]), 
      municipio: new FormControl<string>("", [Validators.required]),
      encargado: new FormControl<string>("", [Validators.required, Validators.pattern(/^[A-Za-záéíóúÁÉÍÓÚñÑüÜ\s]+$/)]),
      telefono: new FormControl<string>("", [Validators.required, Validators.minLength(10), Validators.pattern('^[0-9]+$')]),
      correo: new FormControl<string>("", [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]),
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
    if(this.formulario.invalid){
      console.log(this.formulario.controls)
      marcarFormularioComoSucio(this.formulario)
      return;
    }
    const inputNombre = this.formulario.get('nombre')!
    const inputDepartamento = this.formulario.get('departamento')!
    const inputMunicipio = this.formulario.get('municipio')!
    const inputEncargado = this.formulario.get('encargado')!
    const inputTelefono = this.formulario.get('telefono')!
    const inputCorreo = this.formulario.get('correo')!
    
    const sede: Sede = {
      nombre: inputNombre.value,
      departamento: inputDepartamento.value,
      municipio: inputMunicipio.value,
      correo: inputCorreo.value,
      encargado: inputEncargado.value,
      telefono: inputTelefono.value
    }
    this.registrosACrear.push(sede)
    this.ocultarFormulario()
    this.mostrarMensajeDeGuardado()
    this.valido = this.esValido()
    this.limpiarFormulario()
    this.nuevasSedes.emit( this.obtenerSedesAGuardar() )
  }

  retirarDeRam(indice: number){
    this.registrosACrear.splice(indice, 1)
    this.mostrarMensajeDeGuardado()
    this.valido = this.esValido()
    this.limpiarFormulario();
    this.nuevasSedes.emit( this.obtenerSedesAGuardar() )
  }

  
  eliminarRegistro(indice: number){
    this.registrosAEliminar.push(indice)
    this.mostrarMensajeDeGuardado()
    this.valido = this.esValido()
    this.nuevasSedes.emit( this.obtenerSedesAGuardar() )
  }

  cancelarEliminacionRegistro(indice: number){
    this.registrosAEliminar.splice(indice, 1)
    this.valido = this.esValido()
    this.nuevasSedes.emit( this.obtenerSedesAGuardar() )
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

  esRegistroAEliminar(indice: number): boolean{
    return this.registrosAEliminar.includes(indice)
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
    if(this.registrosAEliminar.length < this.sedes.length){
      return true
    }
    return false
  }

  obtenerSedesAGuardar(): Sede[]{
    let sedesACrear: Sede[] = []
    let sedesAMantener: Sede[] = []
    sedesACrear = this.registrosACrear;
    sedesAMantener = this.sedes.filter((_, indice) =>  !this.registrosAEliminar.includes(indice))
    return [
      ...sedesAMantener,
      ...sedesACrear
    ]
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
