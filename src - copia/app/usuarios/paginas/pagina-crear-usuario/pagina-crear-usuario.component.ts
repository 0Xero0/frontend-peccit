import { Component, OnInit, ViewChild } from '@angular/core';
import { Paginador } from 'src/app/administrador/modelos/compartido/Paginador';
import { FiltrosUsuarios } from '../../modelos/FiltrosUsuarios';
import { ServicioUsuarios } from '../../servicios/usuarios.service';
import { Observable } from 'rxjs';
import { Usuario } from '../../modelos/Usuario';
import { Paginacion } from 'src/app/compartido/modelos/Paginacion';
import { ModalActualizarUsuarioComponent } from '../../componentes/modal-actualizar-usuario/modal-actualizar-usuario.component';
import { Rol } from '../../modelos/Rol';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { marcarFormularioComoSucio } from 'src/app/administrador/utilidades/Utilidades';
import { PopupComponent } from 'src/app/alertas/componentes/popup/popup.component';
import { ServicioDepartamentos } from 'src/app/encuestas/servicios/departamentos.service';
import { Departamento } from 'src/app/encuestas/modelos/Departamento';
import { Ciudad } from 'src/app/encuestas/modelos/Ciudad';
import Swal from 'sweetalert2';
import { PeticionCrearUsuario } from '../../modelos/PeticionCrearUsuario';

@Component({
  selector: 'app-pagina-crear-usuario',
  templateUrl: './pagina-crear-usuario.component.html',
  styleUrls: ['./pagina-crear-usuario.component.css']
})
export class PaginaCrearUsuarioComponent implements OnInit{
  @ViewChild('modalActualizarUsuario') modalActualizarUsuario!: ModalActualizarUsuarioComponent
  @ViewChild('popup') popup!: PopupComponent
  paginador: Paginador<FiltrosUsuarios>
  usuarios: Usuario[] = []
  termino: string = ""
  rol: string = ""
  roles: Rol[] = []
  formulario: FormGroup
  departamentos: Departamento[] = []
  municipios: Ciudad[] = []
  esDepartamentalId: number = 0;
  checkSucio: boolean = false;
  vigilado: boolean = false

  constructor(private servicio: ServicioUsuarios, private servicioDepartamento: ServicioDepartamentos){
    this.paginador = new Paginador<FiltrosUsuarios>(this.obtenerUsuarios)
    this.formulario = new FormGroup({
      nombre: new FormControl(undefined, [ Validators.required ]),
      apellido: new FormControl(undefined),
      identificacion: new FormControl(undefined, [ Validators.required ]),
      fechaNacimiento: new FormControl(undefined, [ Validators.required ]),
      correo: new FormControl(undefined, [ Validators.required, Validators.email ]),
      telefono: new FormControl(undefined),
      rol: new FormControl("", [ Validators.required ]),
      departamento: new FormControl(""/* , [Validators.required] */),
      municipio: new FormControl(""/* , [Validators.required] */),
      esDepartamental: new FormControl(false),
      noEsDepartamental: new FormControl(false),
    })
  }

  ngOnInit(): void {
    this.paginador.inicializar(1, 30)
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

  obtenerUsuarios = (pagina: number, limite: number, filtros?: FiltrosUsuarios)=>{
    return new Observable<Paginacion>( subscripcion => {
      this.servicio.listar(pagina, limite, filtros).subscribe({
        next: (respuesta)=>{
          this.usuarios = respuesta.usuarios
          subscripcion.next(respuesta.paginacion)
        }
      })
    })
  }

  manejarUsuarioActualizado(){
    this.paginador.refrescar()
    this.popup.abrirPopupExitoso('Usuario actualizado con éxito.')
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
    /* console.log("Es departamental: ",this.esDepartamentalId); */

  }

  crear(){
    if(this.formulario.invalid){
      marcarFormularioComoSucio(this.formulario)
      if(this.esDepartamentalId == 0 && this.vigilado){this.checkSucio = true;}
      return;
    }
    if(this.esDepartamentalId == 0 && this.vigilado){
      this.checkSucio = true;
      return
    }
    const controls = this.formulario.controls
    let guardarJSON: PeticionCrearUsuario = {
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
      guardarJSON = {
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
    this.servicio.guardar(guardarJSON).subscribe({
      next: ()=>{
        this.popup.abrirPopupExitoso("Usuario creado con éxito.")
        this.paginador.refrescar()
        this.limpiarFormulario()
      },
      error: ()=>{
        this.popup.abrirPopupFallido("Error al crear el usuario", "Intentalo más tarde.")
      }
    })
  }

  actualizarFiltros(){
    this.paginador.filtrar({
      termino: this.termino,
      rol: this.rol
    })
  }

  limpiarFiltros(){
    this.termino = ""
    this.rol = ""
    this.paginador.filtrar({})
  }

  limpiarFormulario(){
    this.formulario.reset()
    this.formulario.get('rol')!.setValue("")
    this.vigilado = false
  }

  abrirModalActualizarUsuario(usuario: Usuario){
    this.modalActualizarUsuario.abrir(usuario)
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
