import { Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Actividad } from '../../modelos/Actividad';
import { MesCalendarioComponent } from '../mes-calendario/mes-calendario.component';
import { RespuestaEnviar } from 'src/app/encuestas/modelos/RespuestaEnviar';

@Component({
  selector: 'app-calendario-actividades',
  templateUrl: './calendario-actividades.component.html',
  styleUrls: ['./calendario-actividades.component.css']
})
export class CalendarioActividadesComponent implements OnInit{
  @ViewChildren('mesCalendario') mesesCalendario!: QueryList<MesCalendarioComponent>
  @Output() nuevaRespuesta: EventEmitter<RespuestaEnviar>

  @Input() actividades: Actividad[] = []
  @Input() cabeceras: string[] = []
  @Input() actividadesFaltantes: number[] = []
  @Input() soloLectura: boolean = false

  totalesActividades: number[] = []

  constructor(){
    this.nuevaRespuesta = new EventEmitter<RespuestaEnviar>();  
  }

  ngOnInit(): void {
    this.totalesActividades = this.actividades.map(actividad => {
      let total = 0;
      actividad.meses.forEach(mes => {
        let valor = mes.respuesta !== "" ? Number(mes.respuesta) : 0;
        total = total + valor;
      })
      return total
    })
  }

  recalcularTotal({indice, valor}: {indice: number, valor: number}){
    let total = 0; 
    this.mesesCalendario.forEach( componenteMes => {
      if(componenteMes.indice === indice){
        total = total + componenteMes.valor;
      }
    })
    this.totalesActividades[indice] = total;
  }

  manejarNuevaRespuesta(respuesta: RespuestaEnviar){
    this.nuevaRespuesta.emit(respuesta)
  }
}
