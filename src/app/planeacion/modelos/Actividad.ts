import { Validacion } from "src/app/encuestas/modelos/EncuestaCuantitativa"

export interface Actividad{
    meses: Mes[]
    nombre: string
}

export interface Mes{
    datoId: number
    obligatoria: boolean
    respuesta: string
    tipoPregunta: string
    validaciones: Validacion
}