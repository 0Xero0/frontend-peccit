import { Component, Input } from '@angular/core';
import { Formulario } from '../../modelos/FormularioEjecucion';

@Component({
  selector: 'app-tab-formulario-ejecucion',
  templateUrl: './tab-formulario-ejecucion.component.html',
  styleUrls: ['./tab-formulario-ejecucion.component.css']
})
export class TabFormularioEjecucionComponent {
  @Input() tab!: Formulario
}
