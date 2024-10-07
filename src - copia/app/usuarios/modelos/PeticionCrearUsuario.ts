export interface PeticionCrearUsuario{
    nombre: string
    apellido: string
    identificacion: string
    telefono: string
    correo: string
    fechaNacimiento: string
    idRol: string
    departamentoId?: number
    municipioId?: number
    esDepartamental: number
}
