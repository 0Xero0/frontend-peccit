import { Component, EventEmitter, Input, Output } from '@angular/core';
import { marcarFormularioComoSucio } from 'src/app/administrador/utilidades/Utilidades';
import { Sede } from '../../modelos/Sede';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Departamento } from 'src/app/encuestas/modelos/Departamento';
import { Ciudad } from 'src/app/encuestas/modelos/Ciudad';
import { ServicioDepartamentos } from 'src/app/encuestas/servicios/departamentos.service';

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

  constructor(private servicioDepartamento: ServicioDepartamentos){
    this.aCrear = new EventEmitter<Sede>();
    this.aEliminar = new EventEmitter<number[]>();
    this.nuevasSedes = new EventEmitter<Sede[]>();

    this.formulario = new FormGroup({
      nombre: new FormControl<string>("", [Validators.required]), 
      departamento: new FormControl<string>("", [Validators.required]), 
      municipio: new FormControl<string>("", [Validators.required]), 
    })
  }

  ngOnInit(): void {
    this.obtenerTodasLasCiudades()
    this.obtenerDepartamentos()
    this.formulario.get('departamento')!.valueChanges.subscribe({
      next: (departamentoId)=>{
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
  }

  agregarARam(): void{
    if(this.formulario.invalid){
      marcarFormularioComoSucio(this.formulario)
      return;
    }
    const inputNombre = this.formulario.get('nombre')!
    const inputDepartamento = this.formulario.get('departamento')!
    const inputMunicipio = this.formulario.get('municipio')!
    const sede: Sede = {
      nombre: inputNombre.value,
      departamento: inputDepartamento.value,
      municipio: inputMunicipio.value 
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
    this.formulario.get('departamento')!.setValue('')
    this.formulario.get('municipio')!.setValue('')
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
