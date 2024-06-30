import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SoportesService } from 'src/app/soportes/servicios/soportes.service';
import { marcarFormularioComoSucio } from '../../utilidades/Utilidades';
import { PopupComponent } from 'src/app/alertas/componentes/popup/popup.component';
import { MotivoSoporte } from 'src/app/soportes/modelos/MotivoSoporte';

@Component({
  selector: 'app-pagina-soporte',
  templateUrl: './pagina-soporte.component.html',
  styleUrls: ['./pagina-soporte.component.css']
})
export class PaginaSoporteComponent {
  @ViewChild('popup') popup!: PopupComponent
  formulario: FormGroup
  motivos: MotivoSoporte[] = []

  constructor(private servicioSoporte: SoportesService){
    this.obtenerMotivos()
    this.formulario = new FormGroup({
      motivo: new FormControl<number | string>("", [ Validators.required ]),
      descripcion: new FormControl<string | undefined>( undefined, [ Validators.required ] ),
      adjunto: new FormControl<File | null>( null )
    })
  }

  obtenerMotivos(){
    this.servicioSoporte.obtenerMotivos().subscribe({
      next: (motivos)=>{
        this.motivos = motivos
      }
    })
  }

  crearSoporte(){
    if(this.formulario.invalid){
      marcarFormularioComoSucio(this.formulario)
      return
    }
    const controls = this.formulario.controls
    this.servicioSoporte.crearSoporte(
      controls['descripcion'].value,
      controls['motivo'].value,
      controls['adjunto'].value).subscribe({
      next: ( soporte: any )=>{
        this.limpiarFormulario()
        this.popup.abrirPopupExitoso('Soporte creado', 'Radicado', soporte.radicado)
      }
    })
  }

  manejarExcedeTamanio(){
    this.popup.abrirPopupFallido("El archivo pesa más de 7 Mb")
  }

  limpiarFormulario(){
    const controls = this.formulario.controls
    controls['descripcion'].setValue(undefined)
    controls['motivo'].setValue('')
    controls['adjunto'].setValue(null)
    //this.formulario.reset()
  }
}
