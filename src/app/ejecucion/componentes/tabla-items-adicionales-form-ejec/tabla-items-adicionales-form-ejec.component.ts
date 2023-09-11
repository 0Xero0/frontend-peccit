import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Adicional } from '../../modelos/FormularioEjecucion';
import { RespuestaAdicional } from '../../modelos/RespuestaAdicional';

@Component({
  selector: 'app-tabla-items-adicionales-form-ejec',
  templateUrl: './tabla-items-adicionales-form-ejec.component.html',
  styleUrls: ['./tabla-items-adicionales-form-ejec.component.css']
})
export class TablaItemsAdicionalesFormEjecComponent {
  @Output() nuevasRespuestas: EventEmitter<RespuestaAdicional[]>
  @Input() adicionales: Adicional[] = []

  respuestas: RespuestaAdicional[] = []

  constructor(){
    this.nuevasRespuestas = new EventEmitter<RespuestaAdicional[]>();
  }

  manejarNuevaRespuesta(respuesta: RespuestaAdicional){
    if(this.existeRespuesta(respuesta)){
      this.borrarRespuesta(respuesta)
    }
    this.respuestas.push(respuesta)
    this.nuevasRespuestas.emit(this.respuestas)
  }
  
  private existeRespuesta(respuesta: RespuestaAdicional){
    let respuestaEncontrada = this.respuestas.find( respuestaGuardada => respuestaGuardada.adicionalId === respuesta.adicionalId);
    return respuestaEncontrada ? true : false;
  }

  private borrarRespuesta(respuesta: RespuestaAdicional){
    this.respuestas = this.respuestas.filter(respuestaGuardada => respuestaGuardada.adicionalId !== respuesta.adicionalId)
  }
}
