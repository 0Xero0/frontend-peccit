export interface RespuestaErrorImportacion{
    archivo: string
    errores: ErrorImportacion[]
}

export interface ErrorImportacion{
    columna: string
    fila: string
    error: string
    valor: any
}