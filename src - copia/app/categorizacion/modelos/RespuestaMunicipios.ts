export interface RespuestaMunicipios{
    reportaOtrosMunicipios: boolean
    municipios: MunicipioACrear[]
}

export interface MunicipioACrear{
    idDepartamento: number
    idMunicipio: number
    numeroConvenio: string
    convenioPDFDocumento: string
    convenioPDFRuta: string
    convenioPDFOriginal: string
}