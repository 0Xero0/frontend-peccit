import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ServicioEncuestas } from '../../servicios/encuestas.service';
import { MesPatioModalidad } from '../../modelos/MesPatioModalidad';
import { TipoMesPatioModalidad } from '../../TipoMesPatioModalidad';
import { PopupComponent } from 'src/app/alertas/componentes/popup/popup.component';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-pagina-administrar-meses-patios-modalidades',
  templateUrl: './pagina-administrar-meses-patios-modalidades.component.html',
  styleUrls: ['./pagina-administrar-meses-patios-modalidades.component.css']
})
export class PaginaAdministrarMesesPatiosModalidadesComponent implements OnInit {
  @ViewChild('popup') popup!: PopupComponent
  @ViewChild('modalActualizar') modalActualizar!: ElementRef
  mesesPatios: MesPatioModalidad[] = []
  mesesModalidades: MesPatioModalidad[] = []
  mensaje: string = ""
  mesEditar?: MesPatioModalidad
  instanciaModalEditar?: NgbModalRef
  meses = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre'
  ]

  constructor(private servicioEncuestas: ServicioEncuestas, private servicioModal: NgbModal) {

  }

  ngOnInit(): void {
    this.obtenerMesesPatios()
    this.obtenerMesesModalidades()
  }

  obtenerMesesPatios() {
    this.servicioEncuestas.obtenerMesesPatiosModalidades({ tipo: TipoMesPatioModalidad.Patio }).subscribe({
      next: (meses) => {
        this.mesesPatios = meses
      },
      error: (error) => {
        this.popup.abrir({
          icono: 'error',
          titulo: 'Error inesperado',
          texto: 'Intentalo más tarde'
        })
      }
    })
  }

  obtenerMesesModalidades() {
    this.servicioEncuestas.obtenerMesesPatiosModalidades({ tipo: TipoMesPatioModalidad.Modalidad }).subscribe({
      next: (meses) => {
        this.mesesModalidades = meses
      },
      error: (error) => {
        this.popup.abrir({
          icono: 'error',
          titulo: 'Error inesperado',
          texto: 'Intentalo más tarde'
        })
      }
    })
  }

  cambiarEstadoMes(mes: MesPatioModalidad) {
    this.servicioEncuestas.actualizarMesPatioModalidad(mes.id, { estado: !mes.estado }).subscribe({
      next: (mes) => {
        this.popup.abrir({
          icono: 'exitoso',
          titulo: 'Guardado con éxito'
        })
      },
      error: () => {
        this.popup.abrir({
          icono: 'error',
          titulo: 'Error inesperado',
          texto: 'Intentalo más tarde'
        })
      }
    })
  }

  cambiarMensajeMes(mes: MesPatioModalidad, mensaje: string) {
    this.servicioEncuestas.actualizarMesPatioModalidad(mes.id, { mensaje }).subscribe({
      next: () => {
        this.cerrarModalEditar()
        this.popup.abrir({
          icono: 'exitoso',
          titulo: 'Guardado con éxito'
        })
        this.refrescar()
      },
      error: () => {
        this.popup.abrir({
          icono: 'error',
          titulo: 'Error inesperado',
          texto: 'Intentalo más tarde'
        })
      }
    })
  }

  refrescar() {
    this.obtenerMesesModalidades()
    this.obtenerMesesPatios()
  }

  abrirModalEditar(mes: MesPatioModalidad){
    this.mesEditar = mes
    this.mensaje = mes.mensaje
    this.instanciaModalEditar = this.servicioModal.open( this.modalActualizar, {
      centered: true, size: 'md'
    })
  }

  cerrarModalEditar(){
    this.mensaje = ""
    if(this.instanciaModalEditar) this.instanciaModalEditar.close();
  }
}
