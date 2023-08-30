import { Component, Input } from '@angular/core';
import { Actividad } from '../../modelos/Actividad';

@Component({
  selector: 'app-calendario-actividades',
  templateUrl: './calendario-actividades.component.html',
  styleUrls: ['./calendario-actividades.component.css']
})
export class CalendarioActividadesComponent {
  @Input() actividades: Actividad[] = []
  @Input() cabeceras: string[] = [] 
}
