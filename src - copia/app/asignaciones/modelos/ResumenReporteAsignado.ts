export interface ResumenReporteAsignado{
    idReporte: number
    nit: string
    idEncuesta: number
    razonSocial: string
    asignador: string | number | null
    fechaAsignacion: null | string,
    asignado: boolean
    fechaEnvioST: string
    email: string
}