import { Actividad } from "src/app/planeacion/modelos/Actividad"
import { Objetivo } from "src/app/planeacion/modelos/Objetivo"

export interface EncuestaCuantitativa{
    formularios: Formulario[]
    idVigilado: string
    idReporte: string
    idEncuesta: number
    vigencia: string
    soloLectura: boolean
}

export interface Formulario {
    nombre:       string;
    subIndicador: SubIndicador[];
    evidencias: Evidencia[];
    objetivos: Objetivo[];
    cabeceras: string[];
    actividades: Actividad[];
    mensaje: string
}

export interface SubIndicador {
    nombreSubIndicador: string;
    codigo:             number;
    preguntas:          Pregunta[];
}

export interface Evidencia {
    idEvidencia: number
    nombre: string
    tipoEvidencia: string // puede ser "FILE"
    validacionesEvidencia: Validacion
    respuesta: string
    documento: string
    nombreOriginal: string
    ruta: string
    tamanio: number
    obligatoria: boolean
}

export interface Validacion {
    tipoDato: string
    cantDecimal: number
    extension: string
}

export interface Pregunta {
    idPregunta:             number;
    pregunta:               string;
    obligatoria:            boolean;
    respuesta:              string;
    tipoDeEvidencia:        string;
    documento:              string;
    nombreOriginal:         string;
    ruta:                   string;
    adjuntable:             boolean;
    adjuntableObligatorio:  boolean;
    tipoPregunta:           string;
    valoresPregunta:        any[];
    validaciones:           Validacion;
    observacion:            string;
    cumple:                 string;
    observacionCumple:      string;
    corresponde:            string;
    observacionCorresponde: string;
}
