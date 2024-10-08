import { TipoImportacion } from "../TipoImportacion"

export interface Importacion{
    archivo: File | null
    tipo: TipoImportacion
    idMes: number
    vigencia: number
    idVigilado: string
}