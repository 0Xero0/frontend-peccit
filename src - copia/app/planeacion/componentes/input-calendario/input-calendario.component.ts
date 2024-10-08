import { Component, Input, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-input-calendario',
  templateUrl: './input-calendario.component.html',
  styleUrls: ['./input-calendario.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputCalendarioComponent),
      multi: true
    }
  ]
})
export class InputCalendarioComponent {
  @Input() invalido: boolean = false
  @Input('cantidadDecimales') cantidadDecimales: number = 3
  @Input('valorInicial') valorInicial: string = "";
  @Input() largoMaximo: number | null = null
  valor: string = ""
  valorAnterior: string = ""
  deshabilitado: boolean = false
  regex: RegExp

  constructor() {
    this.regex = new RegExp(`^[0-9]*(\\.[0-9]{1,${3}})?$`)
  }

  ngOnInit(): void {
    if (this.cantidadDecimales > 0) {
      this.regex = new RegExp(`^[0-9]*(\\.[0-9]{1,${this.cantidadDecimales}})?$`)
    } else {
      this.regex = new RegExp(`^[0-9]*$`)
    }
    this.valorAnterior = this.valorInicial
  }

  alCambiarValor(valor: string) {
    if (!this.regex.test(valor) && valor !== "") {
      this.valor = this.valorAnterior
    }
    if(valor !== ""){
      this.valor = Number(this.valor).toString()
    }
    this.valorAnterior = this.valor
    this.onChange(this.valor)
  }

  //NgValueAccesor Interface
  onChange = (valor: string) => { }

  onTouched = () => { }

  writeValue(valor: string): void {
    this.valor = valor
  }

  registerOnChange(fn: any): void {
    this.onChange = fn
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn
  }

  setDisabledState?(isDisabled: boolean): void {
    this.deshabilitado = isDisabled
  }
}
