import { Dato } from "./Categorizacion";
import { ModalidadRadioACrear } from "./ModalidadRadioACrear";

export interface PeticionGuardarCategorizacion{
    datos: Dato[]
    modalidadesRadio: ModalidadRadioACrear[]
    modalidadesRadioEliminar: number[] //ids
    totales: {conductores: number, vehiculos: number}
}