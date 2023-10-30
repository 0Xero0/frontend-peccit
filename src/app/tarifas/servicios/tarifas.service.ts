import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Autenticable } from 'src/app/administrador/servicios/compartido/Autenticable';
import { environment } from 'src/environments/environment';
import { FiltrosTarifas } from '../modelos/FiltrosTarifas';
import { PeticionGuardarTarifa } from '../modelos/PeticionGuardarTarifa';
import { Paginable } from 'src/app/administrador/modelos/compartido/Paginable';
import { Tarifa } from '../modelos/Tarifa';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServicioTarifas extends Autenticable {
  public readonly ESTADOS = [
    {
      id: 1,
      descripcion: 'ABIERTO'
    },
    {
      id: 2,
      descripcion: 'EN PROCESO'
    },
    {
      id: 3,
      descripcion: 'CERRADO'
    }
  ]
  private readonly host = environment.urlBackend
  private readonly llaveLocalStorage = 'soporte'

  constructor(private http: HttpClient) {
    super()
  }

  listarTarifas(pagina: number, limite: number, filtros?: FiltrosTarifas){
    const endpoint = `/api/v1/tarifas/obtener?pagina=${pagina}&limite=${limite}`
    return this.http.post<Paginable<Tarifa>>(
        `${this.host}${endpoint}`,
        filtros ?? {},
        { headers: this.obtenerCabeceraAutorizacion() }
    )
  }

  guardarTarifa(peticion: PeticionGuardarTarifa){
    const endpoint = `/api/v1/tarifas`
    return this.http.post<Tarifa>(
        `${this.host}${endpoint}`,
        peticion,
        { headers: this.obtenerCabeceraAutorizacion() }
    )
  }

  eliminarTarifa(idTarifa: number){
    const endpoint = `/api/v1/tarifas/${idTarifa}`
    return this.http.delete(
        `${this.host}${endpoint}`,
        { headers: this.obtenerCabeceraAutorizacion() }
    )
  }

  obtenerServiciosModalidadesEmpresa(): Observable<{serviciosModalidades: {nombre: string, id: number}[]}>{
    const endpoint = '/api/v1/maestras/servicios-modalidades'
    return this.http.get<{serviciosModalidades: {nombre: string, id: number}[]}>(`${this.host}${endpoint}`, { headers: this.obtenerCabeceraAutorizacion() })
  }
}
