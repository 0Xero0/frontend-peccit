import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Actividad } from '../../modelos/FormularioEjecucion';
import { RespuestaEjecucion } from '../../modelos/RespuestaEjecucion';
import { RespuestaActividad } from '../../modelos/RespuestaActividad';

@Component({
  selector: 'app-tabla-actividades-form-ejec',
  templateUrl: './tabla-actividades-form-ejec.component.html',
  styleUrls: ['./tabla-actividades-form-ejec.component.css']
})
export class TablaActividadesFormEjecComponent {
  @Output() nuevasRespuestas: EventEmitter<RespuestaActividad[]>
  @Input() actividades: Actividad[] = []
  
  respuestas: RespuestaActividad[] = [] 

  constructor(){
    this.nuevasRespuestas = new EventEmitter<RespuestaActividad[]>();
  }

  manejarNuevaActividad(respuesta: RespuestaActividad){
    console.log(respuesta)
  }
}
