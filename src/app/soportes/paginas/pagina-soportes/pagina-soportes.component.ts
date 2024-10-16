import { Component, OnInit } from '@angular/core';
import { SoportesService } from '../../servicios/soportes.service';
import { Soporte } from '../../modelos/Soporte';
import { FiltrosSoportes } from '../../FiltrosSoportes';
import { Paginador } from 'src/app/administrador/modelos/compartido/Paginador';
import { Observable } from 'rxjs';
import { Paginacion } from 'src/app/compartido/modelos/Paginacion';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { MenuHeaderPService } from 'src/app/services-menu-p/menu-header-p-service';

@Component({
  selector: 'app-pagina-soportes',
  templateUrl: './pagina-soportes.component.html',
  styleUrls: ['./pagina-soportes.component.css']
})
export class PaginaSoportesComponent implements OnInit {
  formulario: FormGroup
  paginador: Paginador<FiltrosSoportes> 
  soportes: Soporte[] = []
  problemasAcceso?: boolean
  estados = this.servicioSoportes.ESTADOS

  constructor(private servicioSoportes: SoportesService, private router: Router, private activatedRoute: ActivatedRoute, private ServiceMenuP:MenuHeaderPService){
    this.formulario = this.construirFormulario()
    this.paginador = new Paginador<FiltrosSoportes>(this.obtenerSoportes)
    
  }

  ngOnInit(): void {
    //
    this.ServiceMenuP.AsginarRutas(this.router.url,this.router.url); ///paolo
    this.activatedRoute.queryParams.subscribe({
      next: (query)=>{
        this.problemasAcceso = query['acceso'] === 'true' ? true : false 
        this.paginador.inicializar(undefined, undefined, {
          problemaAcceso: this.problemasAcceso,
          fechaCreacion: 'asc',
          estado: 1
        })
      }
    })
  }

  //Acciones
  irAResponderSoporte(soporte: Soporte){
    this.servicioSoportes.guardarEnLocalStorage(soporte)
    this.router.navigate(['/administrar', 'responder-soporte', soporte.id])
  }

  construirFormulario(){
    return new FormGroup({
      termino: new FormControl<string>(""),
      estado: new FormControl<number>(1)
    })
  }

  cambiarFiltros(){
    this.paginador.inicializar(undefined, undefined, {
      estado: this.formulario.get('estado')!.value,
      termino: this.formulario.get('termino')!.value,
      problemaAcceso: this.problemasAcceso,
      fechaCreacion: 'asc'
    })
  }

  //Obtener recursos
  obtenerSoportes = (pagina: number, limite: number, filtros?: FiltrosSoportes) => {
    return new Observable<Paginacion>((subscriptor)=>{
      this.servicioSoportes.obtenerSoportes(pagina, limite, filtros ?? {}).subscribe({
        next: ( resultado )=>{
          this.soportes = resultado.datos
          subscriptor.next(resultado.paginacion)
        }
      })
    })
  }

  //Mapeadores
  obtenerDescripcionEstado(id: string | number): string{
    id = typeof id === 'string' ? Number(id) : id;
    const estado = this.estados.find( estado => estado.id == id)
    return estado ? estado.descripcion : ' - '
  }
 


}
