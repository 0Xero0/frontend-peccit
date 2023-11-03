import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-pagina-visualizar-tarifas',
  templateUrl: './pagina-visualizar-tarifas.component.html',
  styleUrls: ['./pagina-visualizar-tarifas.component.css']
})
export class PaginaVisualizarTarifasComponent {
  idVigilado?: string

  constructor(private activatedRoute: ActivatedRoute){
    activatedRoute.params.subscribe({
      next: (params)=>{
        this.idVigilado = params["idVigilado"]
      }
    })
  }
}
