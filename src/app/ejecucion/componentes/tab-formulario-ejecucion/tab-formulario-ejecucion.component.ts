import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Formulario } from '../../modelos/FormularioEjecucion';
import { RespuestaActividad } from '../../modelos/RespuestaActividad';
import { RespuestaAdicional } from '../../modelos/RespuestaAdicional';

@Component({
  selector: 'app-tab-formulario-ejecucion',
  templateUrl: './tab-formulario-ejecucion.component.html',
  styleUrls: ['./tab-formulario-ejecucion.component.css']
})
export class TabFormularioEjecucionComponent {
  @Input() tab!: Formulario
  @Input() idVigilado!: string
  @Input() actividadesFaltantes: number[] = []
  @Input() adicionalesFaltantes: number[] = []
  @Input() soloLectura: boolean = false;
  @Output() nuevasActividades: EventEmitter<RespuestaActividad[]>
  @Output() nuevosAdicionales: EventEmitter<RespuestaAdicional[]>

  constructor(){
    this.nuevasActividades = new EventEmitter<RespuestaActividad[]>();
    this.nuevosAdicionales = new EventEmitter<RespuestaAdicional[]>();
  }

  manejarNuevosAdicionales(respuestas: RespuestaAdicional[]){
    this.nuevosAdicionales.emit(respuestas)
  }

  manejarNuevasActividades(respuestas: RespuestaActividad[]){
    this.nuevasActividades.emit(respuestas)
  }
}
