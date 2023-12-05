import { EmpresaJurisdiccion } from "src/app/informacion-general/modelos/EmpresaJurisdiccion"

export interface ListaEmpresasEjecucion{
    empresas: EmpresaJurisdiccion[]
    plantilla: string
    cargados: string
    visible: boolean
    mensaje: string
}