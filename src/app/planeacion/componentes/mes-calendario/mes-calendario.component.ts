import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Mes } from '../../modelos/Actividad';
import { RespuestaEnviar } from 'src/app/encuestas/modelos/RespuestaEnviar';

@Component({
  selector: 'app-mes-calendario',
  templateUrl: './mes-calendario.component.html',
  styleUrls: ['./mes-calendario.component.css']
})
export class MesCalendarioComponent implements OnInit{
  @ViewChild('input') input!: ElementRef 
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
    console.log(valor)
    if(valor < 0){
      valor = 0;
      this.input.nativeElement.value = 0;
    }
    if(!valor){
      valor = 0;
    }
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
