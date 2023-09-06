import { Component, Input } from '@angular/core';
import { FormularioEjecucion } from '../../modelos/FormularioEjecucion';

@Component({
  selector: 'app-formulario-ejecucion',
  templateUrl: './formulario-ejecucion.component.html',
  styleUrls: ['./formulario-ejecucion.component.css']
})
export class FormularioEjecucionComponent {
  @Input() formulario!: FormularioEjecucion
}
