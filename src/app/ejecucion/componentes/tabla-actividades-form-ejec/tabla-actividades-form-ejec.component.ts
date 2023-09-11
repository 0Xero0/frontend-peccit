import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Actividad } from '../../modelos/FormularioEjecucion';
import { RespuestaActividad } from '../../modelos/RespuestaActividad';

@Component({
  selector: 'app-tabla-actividades-form-ejec',
  templateUrl: './tabla-actividades-form-ejec.component.html',
  styleUrls: ['./tabla-actividades-form-ejec.component.css']
})
export class TablaActividadesFormEjecComponent {
  @Output() nuevasRespuestas: EventEmitter<RespuestaActividad[]>
  @Input() actividades: Actividad[] = []
  @Input() idVigilado!: string
  
  respuestas: RespuestaActividad[] = [] 

  constructor(){
    this.nuevasRespuestas = new EventEmitter<RespuestaActividad[]>();
  }

  manejarNuevaActividad(respuesta: RespuestaActividad){
    if(this.existeRespuesta(respuesta)){
      this.borrarRespuesta(respuesta)
    }
    this.respuestas.push(respuesta)
    this.nuevasRespuestas.emit(this.respuestas)
  }

  private existeRespuesta(respuesta: RespuestaActividad){
    let respuestaEncontrada = this.respuestas.find( respuestaGuardada => respuestaGuardada.preguntaId === respuesta.preguntaId);
    return respuestaEncontrada ? true : false;
  }

  private borrarRespuesta(respuesta: RespuestaActividad){
    this.respuestas = this.respuestas.filter(respuestaGuardada => respuestaGuardada.preguntaId !== respuesta.preguntaId)
  }
}
