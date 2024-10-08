import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Autenticable } from 'src/app/administrador/servicios/compartido/Autenticable';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServicioInformacionGeneral extends Autenticable {

  private readonly host = environment.urlBackend

  constructor(private http: HttpClient) {
    super()
  }

  obtenerServiciosModalidadesEmpresa(): Observable<{serviciosModalidades: {nombre: string, id: number}[]}>{
    const endpoint = '/api/v1/maestras/servicios-modalidades'
    return this.http.get<{serviciosModalidades: {nombre: string, id: number}[]}>(`${this.host}${endpoint}`, { headers: this.obtenerCabeceraAutorizacion() })
  }

}
