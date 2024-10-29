import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ServicioDepartamentos } from 'src/app/encuestas/servicios/departamentos.service';
import { marcarFormularioComoSucio } from 'src/app/administrador/utilidades/Utilidades';
import { EmpresaJurisdiccionACrear } from '../../modelos/EmpresaJurisdiccionACrear';
import { EmpresaJurisdiccion } from '../../modelos/EmpresaJurisdiccion';
import { ServicioArchivos } from 'src/app/archivos/servicios/archivos.service';
import { ServicioInformacionGeneral } from '../../servicios/informacion-general.service';
import { Departamento } from 'src/app/encuestas/modelos/Departamento';
import { Ciudad } from 'src/app/encuestas/modelos/Ciudad';
import { ErrorAutorizacion } from 'src/app/errores/ErrorAutorizacion';
import { Usuario } from 'src/app/autenticacion/modelos/IniciarSesionRespuesta';
import { ServicioLocalStorage } from 'src/app/administrador/servicios/local-storage.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-tabla-empresas-jurisdiccion',
  templateUrl: './tabla-empresas-jurisdiccion.component.html',
  styleUrls: ['./tabla-empresas-jurisdiccion.component.css']
})

export class TablaEmpresasJurisdiccionComponent {
  @Output('aCrear') aCrear: EventEmitter<EmpresaJurisdiccionACrear[]>
  @Output('aEliminar') aEliminar: EventEmitter<number[]>

  @Input() empresas: EmpresaJurisdiccion[] = []
  @Input() idVigilado!: string
  @Input() empresaRequerida: boolean = false
  @Input() soloLectura: boolean = false
  departamentos: Departamento[] = []
  ciudades: Ciudad[] = []
  todasLasCiudades: Ciudad[] = []
  usuario: Usuario
  filtro: boolean

  formulario: FormGroup<{
    nit: FormControl<string | null>,
    razonSocial: FormControl<string | null>,
    correoelectronico: FormControl<string | null>,
    tipoServicio: FormControl<string | null>,
    departamento: FormControl<number | null>,
    municipio: FormControl<number | string | null>,
    aATipoServicio: FormControl<File | null>,
    aATipoServicioRuta: FormControl<string | null>,
    aATipoServicioDocumento: FormControl<string | null>,
    aATipoServicioOriginal: FormControl<string | null>,
    capacidadTransportadoraA: FormControl<string | null>,
    capacidadTransportadoraB: FormControl<string | null>,
    capacidadTransportadoraC: FormControl<string | null>,
    aACapacidadTransportadora: FormControl<File | null>,
    aACapacidadTransportadoraRuta: FormControl<string | null>,
    aACapacidadTransportadoraDocumento: FormControl<string | null>,
    aACapacidadTransportadoraOriginal: FormControl<string | null>,
  }>
  registrosACrear: EmpresaJurisdiccionACrear[] = []
  registrosAEliminar: number[] = [] //indice de la sede
  formularioVisible: boolean = false
  valido: boolean = true
  debePresentarPesv: boolean = true
  serviciosModalidades: { nombre: string, id: number }[] = []


  constructor(
    private servicioInformacionGeneral: ServicioInformacionGeneral, 
    private servicioArchivos: ServicioArchivos,
    private servicioLocalStorage: ServicioLocalStorage,
    private servicioDepartamento: ServicioDepartamentos
  ) {
    const usuario = this.servicioLocalStorage.obtenerUsuario()
    if(!usuario) throw new ErrorAutorizacion();
    this.usuario = usuario
    this.filtro = this.usuario.esDepartamental !== 1 && !this.usuario.reportaOtroMunicipio ? true : false
    this.aCrear = new EventEmitter<EmpresaJurisdiccionACrear[]>();
    this.aEliminar = new EventEmitter<number[]>();

    this.formulario = new FormGroup<{
      nit: FormControl<string | null>,
      razonSocial: FormControl<string | null>,
      correoelectronico: FormControl<string | null>,
      tipoServicio: FormControl<string | null>,
      departamento: FormControl<number | null>,
      municipio: FormControl<number | string | null>,  
      aATipoServicio: FormControl<File | null>,
      aATipoServicioRuta: FormControl<string | null>,
      aATipoServicioDocumento: FormControl<string | null>,
      aATipoServicioOriginal: FormControl<string | null>,
      capacidadTransportadoraA: FormControl<string | null>,
      capacidadTransportadoraB: FormControl<string | null>,
      capacidadTransportadoraC: FormControl<string | null>,
      aACapacidadTransportadora: FormControl<File | null>,
      aACapacidadTransportadoraRuta: FormControl<string | null>,
      aACapacidadTransportadoraDocumento: FormControl<string | null>,
      aACapacidadTransportadoraOriginal: FormControl<string | null>,
    }>({
      nit: new FormControl<string>("", [Validators.required, Validators.max(999999999999)]),
      razonSocial: new FormControl<string>("", [Validators.required]),
      correoelectronico: new FormControl<string>("", [Validators.required,Validators.email ,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
      tipoServicio: new FormControl<string>("", [Validators.required]),
      departamento: new FormControl<number | null>(null, [Validators.required]),
      municipio: new FormControl<number | string | null>("", [Validators.required]),
      aATipoServicio: new FormControl<File | null>(null, [Validators.required]),
      aATipoServicioRuta: new FormControl<string>("", [Validators.required]),
      aATipoServicioDocumento: new FormControl<string>("", [Validators.required]),
      aATipoServicioOriginal: new FormControl<string>("", [Validators.required]),
      capacidadTransportadoraA: new FormControl<string>("", [Validators.required, Validators.max(99999999)]),
      capacidadTransportadoraB: new FormControl<string>("", [Validators.required, Validators.max(99999999)]),
      capacidadTransportadoraC: new FormControl<string>("", [Validators.required, Validators.max(99999999)]),
      aACapacidadTransportadora: new FormControl<File | null>(null, [Validators.required]),
      aACapacidadTransportadoraRuta: new FormControl<string>("", [Validators.required]),
      aACapacidadTransportadoraDocumento: new FormControl<string>("", [Validators.required]),
      aACapacidadTransportadoraOriginal: new FormControl<string>("", [Validators.required]),
    })
  }

  ngOnInit(): void {
    this.obtenerTodasLasCiudades()
    this.obtenerDepartamentos()
    this.obtenerCiudades(this.usuario.departamentoId, this.filtro)
    this.obtenerServiciosModalidades()

    this.formulario.controls.aATipoServicio.valueChanges.subscribe({
      next: (archivo) => {
        if (archivo) {
          this.servicioArchivos.guardarArchivo(archivo, 'empresas-jurisdiccion', this.idVigilado).subscribe({
            next: (respuesta) => {
              this.formulario.controls.aATipoServicioDocumento.setValue(respuesta.nombreAlmacenado)
              this.formulario.controls.aATipoServicioRuta.setValue(respuesta.ruta)
              this.formulario.controls.aATipoServicioOriginal.setValue(respuesta.nombreOriginalArchivo)
            },
            error: () => { }
          })
        } else {
          this.formulario.controls.aATipoServicioDocumento.setValue("")
          this.formulario.controls.aATipoServicioRuta.setValue("")
          this.formulario.controls.aATipoServicioOriginal.setValue("")
        }
      }
    })

    this.formulario.controls.aACapacidadTransportadora.valueChanges.subscribe({
      next: (archivo) => {
        if (archivo) {
          this.servicioArchivos.guardarArchivo(archivo, 'empresas-jurisdiccion', this.idVigilado).subscribe({
            next: (respuesta) => {
              this.formulario.controls.aACapacidadTransportadoraDocumento.setValue(respuesta.nombreAlmacenado)
              this.formulario.controls.aACapacidadTransportadoraRuta.setValue(respuesta.ruta)
              this.formulario.controls.aACapacidadTransportadoraOriginal.setValue(respuesta.nombreOriginalArchivo)
            },
            error: () => { }
          })
        } else {
          this.formulario.controls.aACapacidadTransportadoraDocumento.setValue("")
          this.formulario.controls.aACapacidadTransportadoraRuta.setValue("")
          this.formulario.controls.aACapacidadTransportadoraOriginal.setValue("")
        }
      }
    })
    this.valido = this.esValido()
  }

  mostrarFormulario() {
    this.formularioVisible = true
  }

  ocultarFormulario() {
    this.formularioVisible = false
    this.limpiarFormulario()
  }
  IsValidadeEmpresaP:boolean=false //linea paolo
  msjCrearcionEmpresaP:string='';
  agregarARam(): void {
    if (this.formulario.invalid) {
      //console.log("coorreo");
      marcarFormularioComoSucio(this.formulario)
      return;
    }

    /**LINEA E PAOLO */
    
     this.servicioInformacionGeneral.validarServiciosNitEmpresaP(this.formulario.controls.nit.value!).subscribe({
      next: (respuesta:any) => {
        console.log(respuesta)
        //this.IsValidadeEmpresaP=respuesta.stat
        this.IsValidadeEmpresaP=respuesta.status
        this.msjCrearcionEmpresaP=''
        for (let msj of respuesta.array_msn){
          this.msjCrearcionEmpresaP=this.msjCrearcionEmpresaP + '<p class="px-2">' + msj + '</p>'
           //console.log(numero);
         }
        if(respuesta.status==false)
        {
                    
          Swal.fire({
            html:this.msjCrearcionEmpresaP,
            icon: "error"
          })
          return
         
        }else{
          Swal.fire({
            html:this.msjCrearcionEmpresaP,
            icon: "info"
          }).then((result) => {
           /*** */
            const empresa: EmpresaJurisdiccionACrear = {
              nit: +this.formulario.controls.nit.value!,
              razon_social: this.formulario.controls.razonSocial.value!,
              correoelectronico: this.formulario.controls.correoelectronico.value!,
              estado: true,
              capacidad_transportadora_a: +this.formulario.controls.capacidadTransportadoraA.value!,
              capacidad_transportadora_b: +this.formulario.controls.capacidadTransportadoraB.value!,
              capacidad_transportadora_c: +this.formulario.controls.capacidadTransportadoraC.value!,
              usuario_id: this.idVigilado,
              departamento: +this.formulario.controls.departamento.value!,
              municipio: +this.formulario.controls.municipio.value!,

              tipo_servicio: +this.formulario.controls.tipoServicio.value!,
              documento_tipo_servicio: this.formulario.controls.aATipoServicioDocumento.value!,
              ruta_tipo_servicio: this.formulario.controls.aATipoServicioRuta.value!,
              original_tipo_servicio: this.formulario.controls.aATipoServicioOriginal.value!,

              documento_transportadora: this.formulario.controls.aACapacidadTransportadoraDocumento.value!,
              ruta_transportadora: this.formulario.controls.aACapacidadTransportadoraRuta.value!,
              original_transportadora: this.formulario.controls.aACapacidadTransportadoraOriginal.value!
            }
            //console.log(empresa)
            //this.IsValidadeEmpresaP=true //este es para probar
            if(this.IsValidadeEmpresaP)
            {
              this.registrosACrear.push(empresa)
              //console.log(this.registrosACrear)
              this.ocultarFormulario()
              this.mostrarMensajeDeGuardado()
              this.valido = this.esValido()
              this.limpiarFormulario()
              this.aCrear.emit(this.registrosACrear)
            } 
           
          });
        }
        
      },
      error:(err)=> {
          //console.log(err)
        return 
      },
    })  
    
    /**corde de aqui el codigo */
    
  }

  retirarDeRam(indice: number) {
    this.registrosACrear.splice(indice, 1)
    this.mostrarMensajeDeGuardado()
    this.valido = this.esValido()
    this.limpiarFormulario();
    this.aCrear.emit(this.registrosACrear)
  }


  eliminarRegistro(idEmpresa: number) {
    this.registrosAEliminar.push(idEmpresa)
    this.mostrarMensajeDeGuardado()
    this.valido = this.esValido()
    this.aEliminar.emit(this.registrosAEliminar)
  }

  cancelarEliminacionRegistro(idEmpresa: number) {
    this.registrosAEliminar = this.registrosAEliminar.filter(idEmpresaAEliminar => !(idEmpresa === idEmpresaAEliminar))
    this.valido = this.esValido()
    this.aEliminar.emit(this.registrosAEliminar)
  }

  limpiarFormulario() {
    this.formulario.reset()
    this.obtenerDepartamentos()
    this.obtenerCiudades(this.usuario.departamentoId, this.filtro)
  }

  limpiarRegistrosEnRam() {
    this.registrosACrear = []
    this.registrosAEliminar = []
  }

  esRegistroAEliminar(idPatio: number): boolean {
    return this.registrosAEliminar.includes(idPatio)
  }

  mostrarMensajeDeGuardado() {
    return this.registrosACrear.length > 0 || this.registrosAEliminar.length > 0 ? true : false;
  }

  estaAgregandoSede(): boolean {
    return this.formularioVisible
  }

  esValido() {
    if (this.registrosACrear.length > 0) {
      return true
    }
    if (this.registrosAEliminar.length < this.empresas.length) {
      return true
    }
    return false
  }

  obtenerServiciosModalidades(){
    this.servicioInformacionGeneral.obtenerServiciosModalidadesEmpresa().subscribe({
      next: (respuesta)=>{
        this.serviciosModalidades = respuesta.serviciosModalidades
      },
      error: ()=>{

      }
    })
  }

  obtenerNombreServicioModalidad(idServicioModalidad: number){
    const servicioModalidad = this.serviciosModalidades.find( sm => sm.id === idServicioModalidad )
    return servicioModalidad ? servicioModalidad.nombre : ""
  }

  descargarArchivo(documento: string, ruta: string, nombreOriginal: string){
    this.servicioArchivos.descargarArchivo(documento, ruta, nombreOriginal)
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
