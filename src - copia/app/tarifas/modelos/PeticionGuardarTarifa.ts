export interface PeticionGuardarTarifa{
    idServicioModalidad: number
    idVigilado: string
    vigencia: number
    tarifaAutorizada: number

    actoAdministrativoDocumento: string
    actoAdministrativoRuta: string
    actoAdministrativoOriginal: string

    estructuraCostosDocumento: string
    estructuraCostosRuta: string
    estructuraCostosOriginal: string
}