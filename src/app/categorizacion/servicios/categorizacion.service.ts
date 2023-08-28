import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Autenticable } from 'src/app/administrador/servicios/compartido/Autenticable';
import { environment } from 'src/environments/environment';
import { Categorizacion } from '../modelos/Categorizacion';
import { InfoCategorizacion } from '../modelos/InfoCategorizacion';
import { Modalidad } from '../modelos/Modalidad';
import { Radio } from '../modelos/Radio';
import { PeticionGuardarCategorizacion } from '../modelos/PeticionGuardarCategorizacion';

@Injectable({
  providedIn: 'root'
})
export class CategorizacionService extends Autenticable{

  private readonly host = environment.urlBackend

  constructor(private http: HttpClient) { 
    super()
  }

  guardarInformacionCategorizacion(peticion: PeticionGuardarCategorizacion){
    const endpoint = `/api/v1/modalidad`
    return this.http.post(`${this.host}${endpoint}`, peticion, { headers: this.obtenerCabeceraAutorizacion() })
  }

  informacionCategorizacion(idEncuesta?: number){
    const endpoint = `/api/v1/usuarios/categorizacion?idEncuesta=${idEncuesta}`
    return this.http.get<InfoCategorizacion>(`${this.host}${endpoint}`, { headers: this.obtenerCabeceraAutorizacion() })
  }

  obtenerFiltros(idUsuario: string){
    const endpoint = `/api/v1/modalidad/filtro?idUsuario=${idUsuario}`
    return this.http.get<Categorizacion>(`${this.host}${endpoint}`, { headers: this.obtenerCabeceraAutorizacion() })
  }

  obtenerModalidades(){
    const endpoint = `/api/v1/modalidad`
    return this.http.get<{modalidades: Modalidad[]}>(`${this.host}${endpoint}`, { headers: this.obtenerCabeceraAutorizacion() })
  }
  
  obtenerRadios(modalidadId: number){
    const endpoint = `/api/v1/radio?modalidad=${modalidadId}`
    return this.http.get<{radios: Radio[]}>(`${this.host}${endpoint}`, { headers: this.obtenerCabeceraAutorizacion() })
  }
}
