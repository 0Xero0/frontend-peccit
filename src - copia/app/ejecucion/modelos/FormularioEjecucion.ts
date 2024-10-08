export interface FormularioEjecucion {
    idVigilado: string
    idReporte: string
    soloLectura: boolean
    idEncuesta: number
    vigencia: number
    mes: number
    formularios: Formulario[]
}

export interface Formulario {
    nombre: string
    actividades: Actividad[]
    adicionales: Adicional[]
}

export interface Actividad {
    nombre: string
    documento: string
    nombreOriginal: string
    ruta: string
    datoId: number
    obligatoria: boolean,
    planeado: number,
    respuesta: string,
    tipoDeEvidencia: string,
    validacionesEvidencia: ValidacionEvidencia
    tipoPregunta: string,
    validacionesPregunta: ValidacionPregunta
}

export interface Adicional {
    idAdicional: number
    pregunta: string
    obligatoria: boolean
    respuesta: string
    documento: string
    nombreOriginal: string
    ruta: string
    adjuntable: boolean
    tipoPregunta: string
    tipo: number
    validacionesPregunta: ValidacionPreguntaAdicional | null
    valoresPregunta: ValorPregunta[] | null
    tieneObservacion: boolean
    adjuntableObligatorio?: boolean
    habilitaObservacion: string[] | null,
    tipoEvidencia: string,
    validacionesEvidencia: ValidacionEvidencia | null,
    observacion: string,
    maxObservacion: number
    maxCaracteres: number
    mensaje: string
}

export interface ValidacionEvidencia {
    tipoDato: string
    cantDecimal: number
    tamanio: number
    extension: string
}

export interface ValidacionPregunta {
    tipoDato: string
    cantDecimal: number
}

export interface ValidacionPreguntaAdicional{
    tipoDato: string
    cantDecimal: number
    tamanio: 10,
    extension: ""
}

export interface ValorPregunta{
    clave: string
    valor: string
    tipo?: 'T' | 'N'
}