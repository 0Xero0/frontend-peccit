import { EmpresaJurisdiccion } from "src/app/informacion-general/modelos/EmpresaJurisdiccion";
import { Patio } from "src/app/informacion-general/modelos/Patio";
import { Sede } from "src/app/informacion-general/modelos/Sede";

export interface Encuesta {
    tipoAccion:      number;
    observacion:     boolean;
    encuestaEditable: boolean
    verificacionVisible: boolean
    verificacionEditable: boolean
    clasificaion:   string;
    descripcionClasificacion: string;
    nombreEncuesta: string;
    idVigilado: string;
    idEncuesta: string;
    razonSocila: string
    estadoActual: string
    clasificaciones: Clasificacion[];
    sedes: Sede[]
    patios: Patio[]
    empresas: EmpresaJurisdiccion[]
}

export interface Clasificacion {
    clasificacion: string;
    preguntas:     Pregunta[];
}

export interface Pregunta {
    idPregunta:             number;
    numeroPregunta:         number;
    tipoPregunta:           string;
    valoresPregunta:        ValoresPregunta[];
    pregunta:               string;
    obligatoria:            boolean;
    respuesta:              string | undefined | null;
    tipoDeEvidencia:        string;
    documento:              string;
    nombreOriginal:         string;
    ruta:                   string;
    cumple:                 string | number | null;
    observacionCumple:      string;
    observacion:            string;
    corresponde:            string | number | null;
    observacionCorresponde: string
    adjuntable:             boolean;
    adjuntableObligatorio:  boolean;
    tieneObservacion: boolean;
    habilitaObservacion: string[];
    validaciones:           Validacion[];
    tamanio: number;
    padre: number | null
    respuestaPadre: string[]
}

export interface Validacion {
    validacion: string;
    max:        number | null | undefined;
    min:        number | null | undefined;
}

export interface ValoresPregunta {
    clave: string;
    valor: string;
}