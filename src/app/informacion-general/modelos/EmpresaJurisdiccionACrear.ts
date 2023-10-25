export interface EmpresaJurisdiccionACrear{
    nit: number
    razon_social: string
    tipo_servicio: number
    original_tipo_servicio: string
    documento_tipo_servicio: string
    ruta_tipo_servicio: string
    capacidad_transportadora_a: number
    capacidad_transportadora_b: number
    capacidad_transportadora_c: number
    original_transportadora: string
    ruta_transportadora: string
    documento_transportadora: string
    departamento: number
    municipio: number
    estado: boolean
    usuario_id: string
}