import { Injectable, QueryList } from '@angular/core';
import { CategoriaClasificacion, CategoriaClasificacionFila, TipoCategoria } from '../modelos/Categorizacion';
import { CategoriaComponent } from '../componentes/categoria/categoria.component';

@Injectable({
  providedIn: 'root'
})
export class ServicioClasificaciones{

  constructor() { 
  }

  totalesCategoriasValidos(categorias: CategoriaClasificacion[]): boolean{
    let validos = true;
    const totalesCategorias = categorias.map( categoria => this.totalCategoria( categoria ) )
    totalesCategorias.reduce( (anterior, actual) => {
        if(anterior != actual){
            validos = false;
        }
        return actual
    })
    return validos
  }

  totalesComponentesCategoriasValidos(categorias: QueryList<CategoriaComponent>){
    let validos = true;
    const totalesCategorias = categorias.map( categoria => categoria.total ?? 0 )
    totalesCategorias.reduce( (anterior, actual) => {
        if(anterior != actual){
            validos = false;
        }
        return actual
    })
    return validos
  }

  //totales desde componentes

  totalComponenteCategoria(categoria: CategoriaComponent, columnaInicio: number, columnaFinal: number){
    let total = 0
    categoria.selectores.forEach( selector => {
      if(selector.columna >= columnaInicio && selector.columna <= columnaFinal){
        total+= selector.valor!
      }
    })
    return total;
  }

  //totales categorias iniciales (desde el json)

  totalCategoria(categoria: CategoriaClasificacion, columnaInicio?: number, columnaFinal?: number){
    let total = 0
    categoria.filas.forEach( fila => {
      total+= this.totalFila(
        fila, 
        columnaInicio ?? 0, 
        columnaFinal  ?? fila.datos.length
      )
    })
    return total;
  }

  totalFila(fila: CategoriaClasificacionFila, columnaInicio: number = 0, columnaFinal: number = (fila.datos.length - 1)){
    let total = 0
    fila.datos.forEach( (dato, indice) =>{
      if(indice >= columnaInicio && indice <= columnaFinal){
        total+= dato.valor ? Number(dato.valor) : 0;
      }
    })
    return total
  }

}
