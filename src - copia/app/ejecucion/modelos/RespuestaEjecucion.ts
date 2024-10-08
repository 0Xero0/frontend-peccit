import { RespuestaActividad } from "./RespuestaActividad"
import { RespuestaAdicional } from "./RespuestaAdicional"

export interface RespuestaEjecucion{
    reporteId: number
    respuestaActividades: RespuestaActividad[]
    adicionales: RespuestaAdicional[]
}