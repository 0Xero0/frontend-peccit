import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-pagina-asignacion-tamano-organizacion',
  templateUrl: './pagina-asignacion-tamano-organizacion.component.html',
  styleUrls: ['./pagina-asignacion-tamano-organizacion.component.css']
})
export class PaginaAsignacionTamanoOrganizacionComponent {
  clasificacion: string = ''

  constructor(activatedRoute: ActivatedRoute){
    activatedRoute.queryParams.subscribe(qs =>{
      this.clasificacion = qs['clasificacion'] 
    })
  }
}
