import { FormControl } from "@angular/forms"

export interface FormularioTarifa{
    idServicioModalidad: FormControl<number | string | null>
    tarifaAutorizada: FormControl<number | null>

    actoAdministrativo: FormControl<File | null>
    actoAdministrativoDocumento: FormControl<string | null>
    actoAdministrativoRuta: FormControl<string | null>
    actoAdministrativoOriginal: FormControl<string | null>

    estructuraCostos: FormControl<File | null>
    estructuraCostosDocumento: FormControl<string | null>
    estructuraCostosRuta: FormControl<string | null>
    estructuraCostosOriginal: FormControl<string | null>
}