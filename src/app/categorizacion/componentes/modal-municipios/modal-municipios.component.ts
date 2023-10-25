import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Ciudad } from 'src/app/encuestas/modelos/Ciudad';
import { Departamento } from 'src/app/encuestas/modelos/Departamento';
import { FormularioMunicipios } from '../../modelos/FormularioMunicipios';
import { ServicioArchivos } from 'src/app/archivos/servicios/archivos.service';
import { Usuario } from 'src/app/autenticacion/modelos/IniciarSesionRespuesta';
import { ServicioLocalStorage } from 'src/app/administrador/servicios/local-storage.service';
import { ErrorAutorizacion } from 'src/app/errores/ErrorAutorizacion';
import { PopupComponent } from 'src/app/alertas/componentes/popup/popup.component';
import { marcarFormularioComoSucio } from 'src/app/administrador/utilidades/Utilidades';
import { CategorizacionService } from '../../servicios/categorizacion.service';
import { MunicipioACrear } from '../../modelos/RespuestaMunicipios';
import { ServicioDepartamentos } from 'src/app/encuestas/servicios/departamentos.service';

@Component({
  selector: 'app-modal-municipios',
  templateUrl: './modal-municipios.component.html',
  styleUrls: ['./modal-municipios.component.css']
})
export class ModalMunicipiosComponent implements OnInit {
  @ViewChild('modal1') modal1!: ElementRef
  @ViewChild('modal2') modal2!: ElementRef
  @ViewChild('popup') popup!: PopupComponent
  mostrarFormulario: boolean = false

  reporta: boolean | null = null
  municipios: MunicipioACrear[] = []
  ciudades: Ciudad[] = []
  departamentos: Departamento[] = []
  todasLasCiudades: Ciudad[] = []
  formulario: FormGroup<FormularioMunicipios>
  usuario: Usuario

  constructor(
    private servicioModal: NgbModal,
    private servicioArchivos: ServicioArchivos,
    private servicioLocalStorage: ServicioLocalStorage,
    private servicioCategorizacion: CategorizacionService,
    private servicioDepartamento: ServicioDepartamentos
  ) {
    const usuario = this.servicioLocalStorage.obtenerUsuario()
    if (!usuario) throw new ErrorAutorizacion();
    this.usuario = usuario
    this.formulario = new FormGroup<FormularioMunicipios>({
      departamento: new FormControl<number | string | null>("", [Validators.required]),
      municipio: new FormControl<number | string | null>("", [Validators.required]),
      numeroConvenio: new FormControl<string | null>("", [Validators.required]),
      convenioPDF: new FormControl<File | null>(null, [Validators.required]),
      convenioPDFDocumento: new FormControl<string | null>("", [Validators.required]),
      convenioPDFRuta: new FormControl<string | null>("", [Validators.required]),
      convenioPDFOriginal: new FormControl<string | null>("", [Validators.required])
    })
  }

  ngOnInit(): void {
    this.obtenerTodasLasCiudades()
    this.obtenerDepartamentos()
    this.obtenerCiudades(this.usuario.departamentoId)
    this.formulario.controls.convenioPDF.valueChanges.subscribe({
      next: (archivo) => {
        if (archivo) {
          this.servicioArchivos.guardarArchivo(archivo, 'municipios', this.usuario.usuario).subscribe({
            next: (respuesta) => {
              this.formulario.controls.convenioPDFDocumento.setValue(respuesta.nombreAlmacenado)
              this.formulario.controls.convenioPDFRuta.setValue(respuesta.ruta)
              this.formulario.controls.convenioPDFOriginal.setValue(respuesta.nombreOriginalArchivo)
            },
            error: () => {
              this.popup.abrirPopupFallido("Ha ocurrido un error inesperado.", "Ha ocurrido un error al procesar el archivo.")
            }
          })
        } else {
          this.formulario.controls.convenioPDFDocumento.setValue("")
          this.formulario.controls.convenioPDFRuta.setValue("")
          this.formulario.controls.convenioPDFOriginal.setValue("")
        }
      }
    })
  }

  agregarMunicipio() {
    if (this.formulario.invalid) {
      marcarFormularioComoSucio(this.formulario)
      return;
    }
    const controles = this.formulario.controls
    this.municipios.push({
      idDepartamento: +controles.departamento.value!,
      idMunicipio: +controles.departamento.value!,
      numeroConvenio: controles.numeroConvenio.value!,
      convenioPDFDocumento: controles.convenioPDFDocumento.value!,
      convenioPDFOriginal: controles.convenioPDFOriginal.value!,
      convenioPDFRuta: controles.convenioPDFRuta.value!
    })
    this.setMostrarFormulario(false)
    this.limpiarFormulario()
  }

  eliminarMunicipio(indexEliminar: number) {
    this.municipios = this.municipios.filter((_, index) => index !== indexEliminar)
  }

  limpiarFormulario() {
    this.formulario.reset()
    this.obtenerDepartamentos()
    this.obtenerCiudades(this.usuario.departamentoId)
  }

  abrirModal1() {
    this.servicioModal.open(this.modal1, {
      size: 'md',
      centered: true,
      backdrop: 'static',
      keyboard: false
    })
  }

  abrirModal2() {
    this.servicioModal.open(this.modal2, {
      size: 'xl',
      centered: true,
      backdrop: 'static',
      keyboard: false
    })
  }

  manejarContinuarAModal2() {
    if (this.reporta === null) return;
    if (this.reporta) {
      this.servicioModal.dismissAll()
      this.abrirModal2()
    } else {
      this.servicioCategorizacion.respuestaMunicipios({
        municipios: [],
        reportaOtrosMunicipios: false
      }).subscribe({
        next: () => {
          this.popup.abrirPopupExitoso("Información almacenada.")
          this.servicioModal.dismissAll()
          this.usuario.abrirModal = false
          this.servicioLocalStorage.actualizarUsuario(this.usuario)
        },
        error: () => {
          this.popup.abrirPopupFallido("Ocurrió un error inesperado.", "Ingresa más tarde.")
        }
      })
    }
  }

  manejarCambioReporta(valor: any) {
  }

  manejarAgregar() {
    this.setMostrarFormulario(true)
  }

  manejarEnviarYContinuar() {
    this.servicioCategorizacion.respuestaMunicipios({
      municipios: this.municipios,
      reportaOtrosMunicipios: true
    }).subscribe({
      next: () => {
        this.servicioModal.dismissAll()
        this.popup.abrirPopupExitoso('Información almacenada.')
        this.usuario.abrirModal = false
        this.servicioLocalStorage.actualizarUsuario(this.usuario)
      },
      error: () => {
        this.popup.abrirPopupFallido('Ocurrió un error inesperado.', 'Intentalo más tarde.')
      }
    })
  }

  manejarCancelar() {
    this.setMostrarFormulario(false)
    this.limpiarFormulario()
  }

  setMostrarFormulario(mostrar: boolean) {
    this.mostrarFormulario = mostrar
  }

  obtenerDepartamentos() {
    this.departamentos = [{
      id: this.usuario.departamentoId,
      name: this.usuario.nombreDepartamento
    }]
    const inputDepartamento = this.formulario.controls['departamento']
    inputDepartamento.setValue(this.usuario.departamentoId)
    inputDepartamento.disable()
  }

  obtenerCiudades(departamentoId: number, filtro: boolean = false) {
    this.servicioDepartamento.obtenerCiudades(departamentoId, filtro).subscribe({
      next: (ciudades) => {
        this.ciudades = ciudades
        if (this.ciudades.length === 1) {
          const inputMunicipio = this.formulario.controls['municipio']
          inputMunicipio.setValue(ciudades[0].id)
          inputMunicipio.disable()
        }
      }
    })
  }

  obtenerTodasLasCiudades() {
    this.servicioDepartamento.obtenerTodasLasCiudades().subscribe({
      next: (ciudades) => {
        this.todasLasCiudades = ciudades
      }
    })
  }

  obtenerNombreDepartamento(idDepartamento: number) {
    const departamento = this.departamentos.find(departamento => departamento.id == idDepartamento)
    return departamento ? departamento.name : idDepartamento.toString()
  }

  obtenerNombreCiudad(idCiudad: number) {
    const ciudad = this.todasLasCiudades.find(ciudad => ciudad.id == idCiudad)
    return ciudad ? ciudad.name : idCiudad.toString()
  }
}
