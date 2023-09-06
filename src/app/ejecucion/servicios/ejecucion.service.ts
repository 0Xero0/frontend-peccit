import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Autenticable } from 'src/app/administrador/servicios/compartido/Autenticable';
import { environment } from 'src/environments/environment';
import { FormularioEjecucion } from '../modelos/FormularioEjecucion';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServicioEjecucion extends Autenticable{

  private readonly host = environment.urlBackend

  constructor(private http: HttpClient) { 
    super()
  }

  consultarEjecucion(idReporte: number){
    const json: FormularioEjecucion = {
        "idVigilado": "901154953",
        "idReporte": "7077",
        "idEncuesta": 2,
        "vigencia": 2023,
        "mes": 9,
        "formularios": [
          {
            "nombre": "Ejecución",
            "actividades": [
              {
                "nombre": "Defina la cantidad de actividades, charlas y encuestas planeadas en referentes a la problemática de movilidad ",
                "datoId": 1,
                "obligatoria": true,
                "planeado": 10,
                "respuesta": "",
                "tipoEvidencia": "FILE",
                "validacionesEvidencia": {
                  "tipoDato": "Archivo PDF",
                  "cantDecimal": 0,
                  "tamanio": 5,
                  "extension": ".pdf"
                },
                "tipoPregunta": "NUMBER",
                "validacionesPregunta": {
                  "tipoDato": "Numéricos Entero",
                  "cantDecimal": 0
                }
              },
              {
                "nombre": "Defina la cantidad de campañas preventivas planeadas en relacion a la legalización del transporte",
                "datoId": 2,
                "obligatoria": true,
                "respuesta": "",
                "planeado": 10,
                "tipoEvidencia": "FILE",
                "validacionesEvidencia": {
                  "tipoDato": "Archivo PDF",
                  "cantDecimal": 0,
                  "tamanio": 5,
                  "extension": ".pdf"
                },
                "tipoPregunta": "NUMBER",
                "validacionesPregunta": {
                  "tipoDato": "Numéricos Entero",
                  "cantDecimal": 0
                }
              },
              {
                "nombre": "Defina la cantidad de jornadas de sensibilización planeadas sobre la debida prestación del servicio píblico de transporte",
                "datoId": 3,
                "obligatoria": true,
                "respuesta": "",
                "planeado": 10,
                "tipoEvidencia": "FILE",
                "validacionesEvidencia": {
                  "tipoDato": "Archivo PDF",
                  "cantDecimal": 0,
                  "tamanio": 5,
                  "extension": ".pdf"
                },
                "tipoPregunta": "NUMBER",
                "validacionesPregunta": {
                  "tipoDato": "Numéricos Entero",
                  "cantDecimal": 0
                }
              },
              {
                "nombre": "Defina la cantidad de campañas planeadas en relacion al cumplimiento de las normas de tránsito y transporte",
                "datoId": 4,
                "obligatoria": true,
                "respuesta": "",
                "planeado": 10,
                "tipoEvidencia": "FILE",
                "validacionesEvidencia": {
                  "tipoDato": "Archivo PDF",
                  "cantDecimal": 0,
                  "tamanio": 5,
                  "extension": ".pdf"
                },
                "tipoPregunta": "NUMBER",
                "validacionesPregunta": {
                  "tipoDato": "Numéricos Entero",
                  "cantDecimal": 0
                }
              },
              {
                "nombre": "Defina la cantidad de campañas planeadas en relacion a los riesgos del uso del transporte informal",
                "datoId": 5,
                "obligatoria": true,
                "respuesta": "",
                "planeado": 10,
                "tipoEvidencia": "FILE",
                "validacionesEvidencia": {
                  "tipoDato": "Archivo PDF",
                  "cantDecimal": 0,
                  "tamanio": 5,
                  "extension": ".pdf"
                },
                "tipoPregunta": "NUMBER",
                "validacionesPregunta": {
                  "tipoDato": "Numéricos Entero",
                  "cantDecimal": 0
                }
              },
              {
                "nombre": "Defina la cantidad de acciones planeadas sobre la prestación del servicio no autorizado identificado en su jurisdición",
                "datoId": 6,
                "obligatoria": true,
                "respuesta": "",
                "planeado": 10,
                "tipoEvidencia": "FILE",
                "validacionesEvidencia": {
                  "tipoDato": "Archivo PDF",
                  "cantDecimal": 0,
                  "tamanio": 5,
                  "extension": ".pdf"
                },
                "tipoPregunta": "NUMBER",
                "validacionesPregunta": {
                  "tipoDato": "Numéricos Entero",
                  "cantDecimal": 0
                }
              },
              {
                "nombre": "Defina la cantidad de controles en vías planeadas para validar el cumplimiento de las rutas autorizadas dentro de su jurisdicción de las modalidades de transporte",
                "datoId": 7,
                "obligatoria": true,
                "respuesta": "",
                "planeado": 10,
                "tipoEvidencia": "FILE",
                "validacionesEvidencia": {
                  "tipoDato": "Archivo PDF",
                  "cantDecimal": 0,
                  "tamanio": 5,
                  "extension": ".pdf"
                },
                "tipoPregunta": "NUMBER",
                "validacionesPregunta": {
                  "tipoDato": "Numéricos Entero",
                  "cantDecimal": 0
                }
              },
              {
                "nombre": "Defina la cantidad de operativos planeados para verificar la auntenticidad de las tarjetas de control y planilla de viaje ocasional en el transporte individual",
                "datoId": 8,
                "obligatoria": true,
                "respuesta": "",
                "planeado": 10,
                "tipoEvidencia": "FILE",
                "validacionesEvidencia": {
                  "tipoDato": "Archivo PDF",
                  "cantDecimal": 0,
                  "tamanio": 5,
                  "extension": ".pdf"
                },
                "tipoPregunta": "NUMBER",
                "validacionesPregunta": {
                  "tipoDato": "Numéricos Entero",
                  "cantDecimal": 0
                }
              },
              {
                "nombre": "Defina la cantidad de operativos de control y vigilancia para el servicio individual de pasajeros",
                "datoId": 9,
                "obligatoria": true,
                "respuesta": "",
                "planeado": 10,
                "tipoEvidencia": "FILE",
                "validacionesEvidencia": {
                  "tipoDato": "Archivo PDF",
                  "cantDecimal": 0,
                  "tamanio": 5,
                  "extension": ".pdf"
                },
                "tipoPregunta": "NUMBER",
                "validacionesPregunta": {
                  "tipoDato": "Numéricos Entero",
                  "cantDecimal": 0
                }
              },
              {
                "nombre": "Defina la cantidad de operativos de control y vigilancia para el servicio de transporte escolar",
                "datoId": 10,
                "obligatoria": true,
                "respuesta": "",
                "planeado": 10,
                "tipoEvidencia": "FILE",
                "validacionesEvidencia": {
                  "tipoDato": "Archivo PDF",
                  "cantDecimal": 0,
                  "tamanio": 5,
                  "extension": ".pdf"
                },
                "tipoPregunta": "NUMBER",
                "validacionesPregunta": {
                  "tipoDato": "Numéricos Entero",
                  "cantDecimal": 0
                }
              },
              {
                "nombre": "Defina la cantidad de operativos de control con la finalidad de verificar que no se exceda la capacidad máxima de los vehículos",
                "datoId": 11,
                "obligatoria": true,
                "respuesta": "",
                "planeado": 10,
                "tipoEvidencia": "FILE",
                "validacionesEvidencia": {
                  "tipoDato": "Archivo PDF",
                  "cantDecimal": 0,
                  "tamanio": 5,
                  "extension": ".pdf"
                },
                "tipoPregunta": "NUMBER",
                "validacionesPregunta": {
                  "tipoDato": "Numéricos Entero",
                  "cantDecimal": 0
                }
              },
              {
                "nombre": "Defina la cantidad de operativos de control con la finalidad de verificar que los vehículos estén siendo utilizados de acuerdo con la tarjeta de operación y/o licencia de tránsito",
                "datoId": 12,
                "obligatoria": true,
                "respuesta": "",
                "planeado": 10,
                "tipoEvidencia": "FILE",
                "validacionesEvidencia": {
                  "tipoDato": "Archivo PDF",
                  "cantDecimal": 0,
                  "tamanio": 5,
                  "extension": ".pdf"
                },
                "tipoPregunta": "NUMBER",
                "validacionesPregunta": {
                  "tipoDato": "Numéricos Entero",
                  "cantDecimal": 0
                }
              },
              {
                "nombre": "Defina la cantidad de operativos de control y vigilancia en paraderos, sitios o centros de acopio no autorizados de las rutas de transporte",
                "datoId": 13,
                "obligatoria": true,
                "respuesta": "",
                "planeado": 10,
                "tipoEvidencia": "FILE",
                "validacionesEvidencia": {
                  "tipoDato": "Archivo PDF",
                  "cantDecimal": 0,
                  "tamanio": 5,
                  "extension": ".pdf"
                },
                "tipoPregunta": "NUMBER",
                "validacionesPregunta": {
                  "tipoDato": "Numéricos Entero",
                  "cantDecimal": 0
                }
              },
              {
                "nombre": "Defina la cantidad de operativos de control frente a legalidad en el transporte en motocicletas y vehículos de uso particular",
                "datoId": 14,
                "obligatoria": true,
                "respuesta": "",
                "planeado": 10,
                "tipoEvidencia": "FILE",
                "validacionesEvidencia": {
                  "tipoDato": "Archivo PDF",
                  "cantDecimal": 0,
                  "tamanio": 5,
                  "extension": ".pdf"
                },
                "tipoPregunta": "NUMBER",
                "validacionesPregunta": {
                  "tipoDato": "Numéricos Entero",
                  "cantDecimal": 0
                }
              }
            ],
            "adicionales": [
              {
                "idAdicional": 1,
                "pregunta": "¿Cuántos comparendos por infracciones de tránsito se han impuesto durante el desarrollo de las funciones de control y vigilancia? ",
                "obligatoria": true,
                "respuesta": "",
                "documento": "",
                "nombreOriginal": "",
                "ruta": "",
                "adjuntable": false,
                "tipoPregunta": "NUMERICO",
                "tipo": 1,
                "validacionesPregunta": {
                  "tipoDato": "Numéricos Entero",
                  "cantDecimal": 0,
                  "tamanio": 10,
                  "extension": ""
                },
                "valoresPregunta": null,
                "tipoEvidencia": "FILE",
                "validacionesEvidencia": {
                  "tipoDato": "Informes Técnicos remitidos y demás soportes (fotografías, listados, etc.).",
                  "cantDecimal": 0,
                  "tamanio": 5,
                  "extension": ".pdf"
                },
                "tieneObservacion": false,
                "habilitaObservacion": null,
                "observacion": "",
                "maxObservacion": 0,
              },
              {
                "idAdicional": 14,
                "pregunta": "¿Cuenta la autoridad de tránsito y transporte con sistemas inteligentes de apoyo al control operativo en vías, como bodycams, comparenderas electrónicas, etc?",
                "obligatoria": true,
                "respuesta": "",
                "documento": "",
                "nombreOriginal": "",
                "ruta": "",
                "adjuntable": false,
                "tipoPregunta": "SELECT",
                "tipo": 1,
                "validacionesPregunta": null,
                "valoresPregunta": [
                  {
                    "clave": "SI",
                    "valor": "S"
                  },
                  {
                    "clave": "NO",
                    "valor": "N"
                  }
                ],
                "tieneObservacion": true,
                "habilitaObservacion": [
                  "N"
                ],
                "tipoEvidencia": "",
                "validacionesEvidencia": null,
                "observacion": "",
                "maxObservacion": 100,                
              },
              {
                "idAdicional": 16,
                "pregunta": "¿Cuenta la autoridad de tránsito y transporte con sistemas inteligentes de apoyo al control operativo en vías, como bodycams, comparenderas electrónicas, etc?",
                "obligatoria": true,
                "respuesta": "",
                "documento": "",
                "nombreOriginal": "",
                "ruta": "",
                "adjuntable": true,
                "adjuntableObligatorio": true,
                "tipoPregunta": "SELECT",
                "valoresPregunta": [
                  {
                    "clave": "SI",
                    "valor": "S"
                  },
                  {
                    "clave": "NO",
                    "valor": "N"
                  }
                ],
                "validacionesPregunta": null,
                "tieneObservacion": true,
                "maxObservacion": 50,
                "observacion": "",
                "habilitaObservacion": [
                  "N"
                ],
                "tipoEvidencia": "FILE",
                "validacionesEvidencia": {
                  "tipoDato": "PDF del acto administrativo de adopción",
                  "cantDecimal": 0,
                  "tamanio": 5,
                  "extension": ".pdf"
                },
                "tipo": 1,
                
              }
            ]
          }
        ]
      }
    const endpoint = `/api/v1/modalidad`
    return new Observable<FormularioEjecucion>((subscripcion)=>{
        subscripcion.next(json)
        subscripcion.complete()
    })
  }
}
