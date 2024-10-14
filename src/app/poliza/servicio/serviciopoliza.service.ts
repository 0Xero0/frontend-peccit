
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Autenticable } from 'src/app/administrador/servicios/compartido/Autenticable';
import { environment } from 'src/environments/environment';


import { Paginable } from 'src/app/administrador/modelos/compartido/Paginable';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServicioPoliza extends Autenticable {
  private readonly host = environment.urlBackend
  private readonly llaveLocalStorage = 'soporte'

  constructor(private http: HttpClient) {
    super()
  }
  
  obtenerListadodeEmpresaP(txtbuscar:string,usuario:string,pag_inicio:number,numero_items:number)
    :Observable<any>{
        let endpoint = `/api/v1/empresas/listarempresas?usuario_id=${usuario}&find=${txtbuscar}&page=${pag_inicio}&numero_items=${numero_items}`
        //console.log(endpoint);
        return this.http.get<any>(
          `${this.host}${endpoint}`,
          { headers: { Authorization: `Bearer ${this.obtenerTokenAutorizacion()}` } }
        )
    }

    obtenerListadodePolizaxEmpresaP(txtbuscar:string,nit:string,pag_inicio:number,numero_items:number)
    :Observable<any>{
        let endpoint = `/api/v1/empresas/listarpoliza?usn_identificacion=${nit}&pol_numero=${txtbuscar}&limit=${numero_items}&page=${pag_inicio}`
        console.log(endpoint);
        return this.http.get<any>(
          `${this.host}${endpoint}`,
          { headers: { Authorization: `Bearer ${this.obtenerTokenAutorizacion()}` } }
        )
    }

    obtenerListadodeAmparoxPolizaP(poliza:string,pag_inicio:number,numero_items:number)
    :Observable<any>{
        let endpoint = `/api/v1/empresas/amparos_poliza?poliza_id=${poliza}&page=${pag_inicio}&numero_items=${numero_items}`
        console.log(endpoint);
        return this.http.get<any>(
          `${this.host}${endpoint}`,
          { headers: { Authorization: `Bearer ${this.obtenerTokenAutorizacion()}` } }
        )
    }
    //http://172.16.3.104:5000/api/v1/empresas/amparos_poliza?poliza_id=5148&page=1&numero_items=5

    obtenerListadodeNovedadxPolizaP(poliza:string,tipoPolizaid:number,pag_inicio:number,numero_items:number)
    :Observable<any>{
        let endpoint = `/api/v1/empresas/novedades_poliza?poliza=${poliza}&tipoPoliza=${tipoPolizaid}&page=${pag_inicio}&numero_items=${numero_items}`
        console.log(endpoint);
        return this.http.get<any>(
          `${this.host}${endpoint}`,
          { headers: { Authorization: `Bearer ${this.obtenerTokenAutorizacion()}` } }
        )
    }
    

    /***
     * http://172.16.3.104:5000/api/v1/empresas/novedades_poliza?poliza=5148&tipoPoliza=2&page=1&numero_items=10

     * 
     http://127.0.0.1:3001/novedades_polizapeccit?poliza=122&tipoPoliza=1&page=1&numero_items=10

     `/api/v1/empresas/novedades_poliza?poliza=${poliza}&tipoPoliza=${tipoPolizaid}&limit=${numero_items}&page=${pag_inicio}`
        poliza: id de polizas
        tipoPoliza: id de tipo soliza



     */
    /*
    listarPolizas(pagina?: any, limite?: any, filtros?: FiltrarPolizas) {
        let endpoint = `/api/v1/poliza/listar_polizas?pagina=${pagina}&limite=${limite}`

        for (const filtro in filtros) {
            const valor = filtros[filtro as keyof FiltrarPolizas];
            if(valor != undefined){
            endpoint+= `&${filtro}=${valor}`
            }
        }
    }*/
}



