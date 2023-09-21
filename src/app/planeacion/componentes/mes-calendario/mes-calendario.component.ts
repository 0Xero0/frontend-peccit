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
  @Output() cambioValor: EventEmitter<{valor: string, indice: number}>
  @Output() nuevaRespuesta: EventEmitter<RespuestaEnviar>;
  @Input() mes!: Mes;
  @Input() indice!: number;
  @Input() invalido: boolean = false
  @Input() soloLectura: boolean = false
  valor: string = ""

  constructor(){
    this.cambioValor = new EventEmitter<{valor: string, indice: number}>();
    this.nuevaRespuesta = new EventEmitter<RespuestaEnviar>();
  }

  ngOnInit(): void {
    const valor = this.mes.respuesta;
    this.setValor(valor, false)
  }

  setValor(valor: string, emitirEvento: boolean = true){
    if(Number(valor) < 0){
      valor = "";
      this.input.nativeElement.value = "";
    }
    if(!valor){
      valor = "";
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

  manejarCambio(valor: string){
    this.setValor(valor, true)
  }
}
