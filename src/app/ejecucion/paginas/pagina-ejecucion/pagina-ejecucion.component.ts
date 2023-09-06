import { Component, OnInit, ViewChild } from '@angular/core';
import { ServicioEjecucion } from '../../servicios/ejecucion.service';
import { FormularioEjecucion } from '../../modelos/FormularioEjecucion';
import { HttpErrorResponse } from '@angular/common/http';
import { PopupComponent } from 'src/app/alertas/componentes/popup/popup.component';

@Component({
  selector: 'app-pagina-ejecucion',
  templateUrl: './pagina-ejecucion.component.html',
  styleUrls: ['./pagina-ejecucion.component.css']
})
export class PaginaEjecucionComponent implements OnInit{
  @ViewChild('popup') popup!: PopupComponent

  constructor(private servicio: ServicioEjecucion){}

  formulario?: FormularioEjecucion

  ngOnInit(): void {
    this.obtenerEjecucion(1)
  }

  obtenerEjecucion(idReporte: number){
    this.servicio.consultarEjecucion(idReporte).subscribe({
      next: (formulario)=>{
        this.formulario = formulario
      },
      error: (error: HttpErrorResponse)=>{
        if(error.status === 404){
          this.popup.abrirPopupFallido("No se encontró el reporte.", "Debe planear antes de rellenar el formulario de ejecución.")
        }else{
          this.popup.abrirPopupFallido("Ocurrio un error.", "Ocurrió un error inesperado.")
        }
      },
      complete: ()=>{

      }
    })
  }
}
