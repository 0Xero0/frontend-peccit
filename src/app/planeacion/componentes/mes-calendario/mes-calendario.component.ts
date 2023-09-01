import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Mes } from '../../modelos/Actividad';
import { RespuestaEnviar } from 'src/app/encuestas/modelos/RespuestaEnviar';

@Component({
  selector: 'app-mes-calendario',
  templateUrl: './mes-calendario.component.html',
  styleUrls: ['./mes-calendario.component.css']
})
export class MesCalendarioComponent implements OnInit{
  @Output() cambioValor: EventEmitter<{valor: number, indice: number}>
  @Output() nuevaRespuesta: EventEmitter<RespuestaEnviar>;
  @Input() mes!: Mes;
  @Input() indice!: number;
  valor: number = 0

  constructor(){
    this.cambioValor = new EventEmitter<{valor: number, indice: number}>();
    this.nuevaRespuesta = new EventEmitter<RespuestaEnviar>();
  }

  ngOnInit(): void {
    const valor = this.mes.respuesta !== "" ? Number(this.mes.respuesta) : 0; 
    this.setValor(valor, false)
  }

  setValor(valor: number, emitirEvento: boolean = true){
    this.valor = valor
    if(emitirEvento){
      this.nuevaRespuesta.emit({
        preguntaId: this.mes.datoId,
        valor: this.valor.toString()
      })
      this.cambioValor.emit({ 
        indice: this.indice,
        valor
      })
    }
  }

  manejarCambio(valor: number){
    this.setValor(valor, true)
  }
}
