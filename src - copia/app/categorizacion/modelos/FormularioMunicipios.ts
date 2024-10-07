import { FormControl } from "@angular/forms";

export interface FormularioMunicipios{
    departamento: FormControl<number | null | string>,
    municipio: FormControl<number | null | string>,
    numeroConvenio: FormControl<string | null>,
    convenioPDF: FormControl<File | null>,
    convenioPDFDocumento: FormControl<string | null>,
    convenioPDFRuta: FormControl<string | null>,
    convenioPDFOriginal: FormControl<string | null>,
}