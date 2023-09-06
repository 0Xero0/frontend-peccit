import { Component, Input } from '@angular/core';
import { Adicional } from '../../modelos/FormularioEjecucion';
import { RespuestaAdicional } from '../../modelos/RespuestaAdicional';

@Component({
  selector: 'app-tabla-items-adicionales-form-ejec',
  templateUrl: './tabla-items-adicionales-form-ejec.component.html',
  styleUrls: ['./tabla-items-adicionales-form-ejec.component.css']
})
export class TablaItemsAdicionalesFormEjecComponent {
  @Input() adicionales: Adicional[] = []

  manejarNuevoAdicional(adicional: RespuestaAdicional){
    console.log(adicional)
  }
}
