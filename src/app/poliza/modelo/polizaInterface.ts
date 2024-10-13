export interface ModalidadesPModel{
    estado?: boolean,
    id?: number,
    nombre?: string,
}

export interface TipoBuscarPModel{   
    id: number,
    nombre?: string,
}

export interface EmpresaPModel{
    id?:number,   
    nit: string,
    razon_social?: string,
    modalidad: string,
    departamento: string,
    municipio: string,
    capacidadTA: number,
    capacidadTB: number,
    capacidadTC: number,
    estado:boolean
}

export interface PolizaPModel{
    id:number,   
    tipo_poliza: string,
    tipo_poliza_id:number,   
    n_poliza: string,    
    estado: boolean,
    fecha_cargue: string,
    v_fecha_inicio: string,
    v_fecha_final: string,
    aseguradora:string,
    cantidad_vehiculo: number
}

export interface FiltrarPolizas {
    poliza: string
    tipoPoliza: string | number
    fechaInicio: string
    fechaFin: string
  }