import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Usuario } from '../../modelos/Usuario';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ServicioUsuarios } from '../../servicios/usuarios.service';
import { marcarFormularioComoSucio } from 'src/app/administrador/utilidades/Utilidades';
import { PopupComponent } from 'src/app/alertas/componentes/popup/popup.component';
import { Rol } from '../../modelos/Rol';
import { DateTime } from 'luxon';
import { ServicioDepartamentos } from 'src/app/encuestas/servicios/departamentos.service';
import { Departamento } from 'src/app/encuestas/modelos/Departamento';
import { Ciudad } from 'src/app/encuestas/modelos/Ciudad';
import { PeticionActualizarUsuario } from '../../modelos/PeticionActualizarUsuario';

@Component({
  selector: 'app-modal-actualizar-usuario',
  templateUrl: './modal-actualizar-usuario.component.html',
  styleUrls: ['./modal-actualizar-usuario.component.css']
})
export class ModalActualizarUsuarioComponent implements OnInit{
  @ViewChild('modal') modal!: ElementRef
  @ViewChild('popup') popup!: PopupComponent

  @Output('usuarioActualizado') usuarioActualizado: EventEmitter<void>;
  usuario?: Usuario
  formulario: FormGroup
  roles: Rol[] = []
  departamentos: Departamento[] = []
  municipios: Ciudad[] = []
  esDepartamentalId: number = 0;
  checkSucio: boolean = false;
  vigilado: boolean = false

  constructor(private servicioModal: NgbModal, private servicio: ServicioUsuarios, private servicioDepartamento: ServicioDepartamentos){
    this.usuarioActualizado = new EventEmitter<void>();
    this.formulario = new FormGroup({
      nombre: new FormControl(undefined, [ Validators.required ]),
      apellido: new FormControl(undefined),
      identificacion: new FormControl(undefined, [ Validators.required ]),
      fechaNacimiento: new FormControl(undefined, [ Validators.required ]),
      correo: new FormControl(undefined, [ Validators.required ]),
      telefono: new FormControl(undefined),
      rol: new FormControl("", [ Validators.required ]),
      departamento: new FormControl(""/* , [Validators.required] */),
      municipio: new FormControl(""/* , [Validators.required] */),
      esDepartamental: new FormControl(false),
      noEsDepartamental: new FormControl(false),
    })
  }

  ngOnInit(): void {
    this.obtenerRoles()
    this.obtenerDepartamentos()
    this.formulario.controls['departamento'].valueChanges.subscribe({
      next: (idDepartamento)=>{
        if(idDepartamento && idDepartamento !== ""){
          this.obtenerMunicipios(idDepartamento)
        }else{
          this.municipios = []
        }
      }
    })
  }

  abrir(usuario: Usuario){
    this.usuario = usuario
    this.rellenarFormulario(usuario)
    this.servicioModal.open(this.modal, {
      size: 'xl'
    })
  }

  cerrar(){
    this.servicioModal.dismissAll();
  }

  checkEsDepartamental(event:any,esDepartamental:number){
    /* console.log("Event: ",event.target.checked); */
    if(esDepartamental == 1 && event.target.checked){
      this.esDepartamentalId = esDepartamental
      this.formulario.controls['noEsDepartamental'].disable(); this.checkSucio = false;
    }else if(esDepartamental == 2 && event.target.checked){
      this.esDepartamentalId = esDepartamental
      this.formulario.controls['esDepartamental'].disable(); this.checkSucio = false;
    }else if(!event.target.checked){
      this.checkSucio = true;
      this.formulario.controls['noEsDepartamental'].enable()
      this.formulario.controls['esDepartamental'].enable()
    }
    console.log("Es departamental: ",this.esDepartamentalId);

  }

  actualizar(){
    console.log(this.formulario.controls)
    if(this.formulario.invalid){
      marcarFormularioComoSucio(this.formulario)
      if(this.esDepartamentalId == 0){this.checkSucio = true;}
      return;
    }
    if(this.esDepartamentalId == 0){
      this.checkSucio = true;
      return
    }
    /* if(this.esDepartamentalId == 1){console.log('Es 1');}
    if(this.esDepartamentalId == 2){console.log('Es 2');} */
    const controls = this.formulario.controls
    let actualizarJSON: PeticionActualizarUsuario = {
      apellido: controls['apellido'].value,
        nombre: controls['nombre'].value,
        correo: controls['correo'].value,
        fechaNacimiento: controls['fechaNacimiento'].value,
        identificacion: controls['identificacion'].value,
        idRol: controls['rol'].value,
        telefono: controls['telefono'].value,
        esDepartamental: this.esDepartamentalId
    }
    if(this.vigilado){
      actualizarJSON = {
        apellido: controls['apellido'].value,
        nombre: controls['nombre'].value,
        correo: controls['correo'].value,
        fechaNacimiento: controls['fechaNacimiento'].value,
        identificacion: controls['identificacion'].value,
        idRol: controls['rol'].value,
        telefono: controls['telefono'].value,
        departamentoId: controls['departamento'].value,
        municipioId: controls['municipio'].value,
        esDepartamental: this.esDepartamentalId
      }
    }
    this.servicio.actualizar(this.usuario!.identificacion, actualizarJSON).subscribe({
      next: ()=>{
        this.usuarioActualizado.emit();
        this.cerrar()
      },
      error: ()=>{
        this.popup.abrirPopupFallido("Error al actualizar el usuario", "Intentalo más tarde.")
      }
    })
  }

  rellenarFormulario(usuario: Usuario){
    const controls = this.formulario.controls
    controls['apellido'].setValue(usuario.apellido)
    controls['nombre'].setValue(usuario.nombre)
    controls['correo'].setValue(usuario.correo)
    controls['fechaNacimiento'].setValue(
      DateTime.fromISO(usuario.fechaNacimiento).toFormat('yyyy-MM-dd')
    )
    controls['identificacion'].setValue(usuario.identificacion)
    controls['rol'].setValue(usuario.idRol)
    controls['telefono'].setValue(usuario.telefono)
    controls['departamento'].setValue(usuario.departamentoId)
    controls['municipio'].setValue(usuario.municipioId)
    if(usuario.esDepartamental == 1){
      this.esDepartamentalId = usuario.esDepartamental
      controls['esDepartamental'].setValue(true)
      this.formulario.controls['noEsDepartamental'].disable()
    }else if(usuario.esDepartamental == 2){
      this.esDepartamentalId = usuario.esDepartamental
      controls['noEsDepartamental'].setValue(true)
      this.formulario.controls['esDepartamental'].disable()
    } else if(usuario.esDepartamental == 0){
      this.esDepartamentalId = usuario.esDepartamental
      controls['noEsDepartamental'].setValue(false)
      controls['esDepartamental'].setValue(false)
      this.formulario.controls['noEsDepartamental'].enable()
      this.formulario.controls['esDepartamental'].enable()
    }
    if(usuario.idRol == '003'){
      this.vigilado = true
    }else{this.vigilado = false}
  }

  limpiarFormulario(){
    this.formulario.reset()
    this.formulario.get('rol')!.setValue("")
  }

  obtenerRoles(){
    this.servicio.listarRoles().subscribe({
      next: (respuesta) => {
        this.roles = respuesta.rols
      }
    })
  }

  obtenerDepartamentos(){
    this.servicioDepartamento.obtenerDepartamentos().subscribe({
      next: (departamentos)=>{
        this.departamentos = departamentos
      }
    })
  }

  obtenerMunicipios(departamentoId: number){
    this.servicioDepartamento.obtenerCiudades(departamentoId).subscribe({
      next: (municipios)=>{
        this.municipios = municipios
      }
    })
  }

  esVigilado(event:any){
    /* console.log(event.target.value); */
    const controls = this.formulario.controls
    if(event){
      if(event.target.value == '003'){
        this.vigilado = true
        controls['departamento'].setValidators([Validators.required]);this.formulario.get('departamento')?.updateValueAndValidity()
        controls['municipio'].setValidators([Validators.required]);this.formulario.get('municipio')?.updateValueAndValidity()
        //if(this.esDepartamentalId == 0 && this.vigilado){this.checkSucio = true;}
      }else{
        this.vigilado = false; this.checkSucio = false;
        controls['noEsDepartamental'].setValue(false); controls['esDepartamental'].setValue(false)
        this.formulario.get('departamento')?.clearValidators();this.formulario.get('departamento')?.updateValueAndValidity()
        this.formulario.get('municipio')?.clearValidators();this.formulario.get('municipio')?.updateValueAndValidity()
      }
    }
  }

}
