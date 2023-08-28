import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-acordeon',
  templateUrl: './acordeon.component.html',
  styleUrls: ['./acordeon.component.css']
})
export class AcordeonComponent {
  @Input('invalido') invalido = false
  itemActivo = false

  cambiarEstadoItemActivo(){
    this.itemActivo = !this.itemActivo
  }
}
