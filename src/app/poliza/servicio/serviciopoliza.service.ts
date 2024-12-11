
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
        return this.http.get<any>(
          `${this.host}${endpoint}`,
          { headers: { Authorization: `Bearer ${this.obtenerTokenAutorizacion()}` } }
        )
    }

    obtenerListadodePolizaxEmpresaP(txtbuscar:string,nit:string,pag_inicio:number,numero_items:number)
    :Observable<any>{
        let endpoint = `/api/v1/empresas/listarpoliza?usn_identificacion=${nit}&pol_numero=${txtbuscar}&limit=${numero_items}&page=${pag_inicio}`
        
        return this.http.get<any>(
          `${this.host}${endpoint}`,
          { headers: { Authorization: `Bearer ${this.obtenerTokenAutorizacion()}` } }
        )
    }

    obtenerListadodeAmparoxPolizaP(poliza:string,pag_inicio:number,numero_items:number)
    :Observable<any>{
        let endpoint = `/api/v1/empresas/amparos_poliza?poliza_id=${poliza}&page=${pag_inicio}&numero_items=${numero_items}`
      
        return this.http.get<any>(
          `${this.host}${endpoint}`,
          { headers: { Authorization: `Bearer ${this.obtenerTokenAutorizacion()}` } }
        )
    }    

    obtenerListadodeNovedadxPolizaP(poliza:string,tipoPolizaid:number,pag_inicio:number,numero_items:number)
    :Observable<any>{
        let endpoint = `/api/v1/empresas/novedades_poliza?poliza=${poliza}&tipoPoliza=${tipoPolizaid}&page=${pag_inicio}&numero_items=${numero_items}`
      
        return this.http.get<any>(
          `${this.host}${endpoint}`,
          { headers: { Authorization: `Bearer ${this.obtenerTokenAutorizacion()}` } }
        )
    }

    obtenerResponsabilidadxPolizaP(poliza:string)
    :Observable<any>{
        let endpoint = `/api/v1/empresas/responsabilidad_poliza?poliza_id=${poliza}`
       
        return this.http.get<any>(
          `${this.host}${endpoint}`,
          { headers: { Authorization: `Bearer ${this.obtenerTokenAutorizacion()}` } }
        )
    }
    

    
}



