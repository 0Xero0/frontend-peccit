import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ServicioEncuestas } from '../../servicios/encuestas.service';
import { Encuesta } from '../../modelos/Encuesta';
import { ServicioLocalStorage } from 'src/app/administrador/servicios/local-storage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Usuario } from 'src/app/autenticacion/modelos/IniciarSesionRespuesta';
import { EncuestaComponent } from '../../componentes/encuesta/encuesta.component';
import { PopupComponent } from 'src/app/alertas/componentes/popup/popup.component';
import { HttpErrorResponse } from '@angular/common/http';
import { saveAs } from 'file-saver';
import { EncuestaCuantitativa } from '../../modelos/EncuestaCuantitativa';
import { EncuestaCuantitativaComponent } from '../../componentes/encuesta-cuantitativa/encuesta-cuantitativa/encuesta-cuantitativa.component';
import { ModalConfirmarEnviarComponent } from '../../componentes/modal-confirmar-enviar/modal-confirmar-enviar.component';
import { DialogosEncuestas } from '../../dialogos-encuestas';
import { RespuestaInvalida } from '../../modelos/RespuestaInvalida';
import { ErrorAutorizacion } from 'src/app/errores/ErrorAutorizacion';
import { ID_ROLES } from 'src/app/compartido/Roles';
import { MunicipioReportado } from 'src/app/usuarios/modelos/MunicipioReportado';
import { ServicioUsuarios } from 'src/app/usuarios/servicios/usuarios.service';
import { MenuHeaderPService } from 'src/app/services-menu-p/menu-header-p-service';

@Component({
  selector: 'app-pagina-encuesta',
  templateUrl: './pagina-encuesta.component.html',
  styleUrls: ['./pagina-encuesta.component.css']
})
export class PaginaEncuestaComponent implements OnInit ,AfterViewInit{
  @ViewChild('popup') popup!: PopupComponent
  @ViewChild('modalConfirmar') modalConfirmar!: ModalConfirmarEnviarComponent
  @ViewChild('componenteEncuesta') componenteEncuesta!: EncuestaComponent
  @ViewChild('componenteEncuestaCuantitativa') componenteEncuestaCuantitativa!: EncuestaCuantitativaComponent
  usuario?: Usuario | null
  encuesta?: Encuesta
  encuestaCuantitativa?: EncuestaCuantitativa 
  vigencia?: string
  idVigilado?: string
  idReporte?: number
  idUsuario: string
  idEncuesta?: number
  soloLectura: boolean = false
  camposDeVerificacion: boolean = false
  camposDeVerificacionVisibles: boolean = true
  hayCambios: boolean = false
  esAdministrador: boolean = false
  municipiosReportados: MunicipioReportado[] = []

  constructor(
    private servicioEncuesta: ServicioEncuestas, 
    private servicioLocalStorage: ServicioLocalStorage,
    private servicioUsuarios: ServicioUsuarios,
    private router: Router,
    private activeRoute: ActivatedRoute,
    public ServiceMenuP:MenuHeaderPService
  ) {
    const usuario = this.servicioLocalStorage.obtenerUsuario()
    const rol = this.servicioLocalStorage.obtenerRol()
    if(!usuario || !rol) throw new ErrorAutorizacion();
    this.usuario = usuario
    this.esAdministrador = rol.id === ID_ROLES.Administrador ? true : false
    this.idUsuario = this.usuario.usuario
    this.activeRoute.queryParams.subscribe({
      next: (qs) => {
        this.idVigilado = qs['vigilado']
        this.idReporte = Number(qs['reporte'])
      }
    })
    this.activeRoute.params.subscribe({
      next: (parametros)=>{
        this.idEncuesta = parametros['idEncuestaDiligenciada']
        if(this.idEncuesta == 2){
          //this.ServiceMenuP.RutaModelo=`/encuestas/${this.idEncuesta}`;//paolo
          this.obtenerEncuestaCuantitativa()
        }else{
          //this.ServiceMenuP.RutaModelo=`/encuestas/${this.idEncuesta}`;//paolo
          this.obtenerEncuesta()
        }
      }
    }) 
    
  }

  ngOnInit(): void {
    if(this.esAdministrador){
      this.obtenerMunicipiosReportados()
    }
    
    //this.ServiceMenuP.RutaModelo='xxx'
    //console.log(this.ServiceMenuP.RutaModelo)
    this.ServiceMenuP.RutaModelo=`/encuestas/${this.idEncuesta}`;//paolo
    
 
  }
  ngAfterViewInit()
  {
    ///console.log(this.ServiceMenuP.RutaModelo)
    //this.ServiceMenuP.RutaModelo=`/encuestas/${this.idEncuesta}`;//paolo
    
  }
  
  //Manejadores de eventos
  manejarEncuestaGuardada(){
    this.obtenerEncuesta()
  }

  manejarEncuestaCuantitativaGuardada(){
    this.obtenerEncuestaCuantitativa()
  }

  //Acciones

  exportarPDF(){
    this.componenteEncuesta.exportarPDF()
  }

  exportarExcel(){
    if(!this.idReporte){
      this.popup.abrirPopupFallido('No se pudo exportar el reporte.', 'No se ha asignado un reporte para exportar.')
      return;
    }
    this.servicioEncuesta.exportarExcel(this.idReporte).subscribe({
      next: (response)=>{
        saveAs(response, 'datos.xlsx')
      },
      error: ()=>{
        this.popup.abrirPopupFallido('Ocurrio un error inesperado.', 'Intentalo más tarde.')
      }
    })
  }

  guardarEncuesta(){
    if(this.idEncuesta == 2){
      this.guardarEncuestaCuantitativa()
      return;
    }
    this.componenteEncuesta.guardarRespuestas()
  }

  guardarEncuestaCuantitativa(){
    this.componenteEncuestaCuantitativa.guardar()
  }

  enviarEncuestaCuantitativa(){
    this.componenteEncuestaCuantitativa.enviar()
  }

  enviarEncuesta(){
    if(this.idEncuesta == 2){
      this.enviarEncuestaCuantitativa()
      return;
    }
    if(!this.idEncuesta || !this.idReporte || !this.idVigilado){
      this.popup.abrirPopupFallido('Error', 'Faltan datos de la encuesta, el reporte o el vigilado')
      return;
    }

    this.servicioEncuesta.enviarRespuesta(this.idEncuesta!, this.idReporte!,  this.idVigilado!).subscribe({
      next: ()=>{
        this.popup.abrirPopupExitoso('Formulario enviado', 'El formulario se ha enviado correctamente.')
        this.router.navigate(['/administrar', 'encuestas', this.idEncuesta!])
      },
      error: (error: HttpErrorResponse)=>{
        const faltantes = error.error.faltantes as RespuestaInvalida[]
        this.componenteEncuesta.resaltarRespuestasInvalidas(faltantes)
        this.componenteEncuesta.sedeRequerida = !error.error.sedes
        this.componenteEncuesta.empresaRequerida = !error.error.tieneEmpresa
        this.modalConfirmar.abrir({
          seRequiereSede: !error.error.sedes,
          respuestasInvalidas: faltantes,
          sinPatios: !this.tienePatios(),
          sinEmpresas: !this.tieneEmpresas(),
          alAceptar: ()=>{
            this.servicioEncuesta.enviarRespuesta(this.idEncuesta!, this.idReporte!,  this.idVigilado!, true).subscribe({
              next: ()=>{
                this.popup.abrirPopupExitoso('Formulario enviado', 'El formulario se ha enviado correctamente.')
                this.router.navigate(['/administrar', 'encuestas', this.idEncuesta!])
              },
              error: (error: HttpErrorResponse)=>{
                this.popup.abrirPopupFallido(
                  DialogosEncuestas.ENVIAR_ENCUESTA_ERROR_TITULO, 
                  DialogosEncuestas.ENVIAR_ENCUESTA_ERROR_DESCRIPCION
                )
              }
            })
          },
          alCancelar: ()=>{}
        })
      }
    })
  }

  //Obtener información
  obtenerEncuestaCuantitativa(){
        
    this.servicioEncuesta.obtenerEncuestaCuantitativa(this.idReporte!, this.idVigilado!).subscribe({
      next: (encuesta)=>{
        this.encuestaCuantitativa = encuesta
        this.soloLectura = encuesta.soloLectura
        this.vigencia = encuesta.vigencia
        //this.ServiceMenuP.RutaModelo=`/encuestas/${this.idEncuesta}`;//paolo
      }
    })
    
    
  }

  obtenerEncuesta(){
    
    this.servicioEncuesta.obtenerEncuesta(this.idVigilado!, this.idEncuesta!, this.idReporte!).subscribe({
      next: ( encuesta )=>{
        this.encuesta = encuesta
        this.soloLectura = !encuesta.encuestaEditable
        this.camposDeVerificacion = encuesta.verificacionEditable
        this.camposDeVerificacionVisibles = encuesta.verificacionVisible
        //this.ServiceMenuP.RutaModelo=`/encuestas/${this.idEncuesta}`;//paolo
      }
    })
    //
    //console.log('desde encuenta sola')
    //console.log(this.ServiceMenuP.RutaModelo)
    this.ServiceMenuP.RutaModelo=`/encuestas/${this.idEncuesta}`;//paolo
  }

  obtenerMunicipiosReportados(){
    this.servicioUsuarios.obtenerMunicipiosDeUsuario(this.idVigilado!).subscribe({
      next: (municipios)=>{
        this.municipiosReportados = municipios
      }
    })
  }

  verTarifas(){
    this.router.navigateByUrl(`administrar/tarifas/${this.idVigilado}`)
  }

  //Setters
  setHayCambios(hayCambios: boolean){
    this.hayCambios = hayCambios
  }
  
  tienePatios(): boolean{
    const patiosAEliminar = this.componenteEncuesta.patiosAEliminar.length
    const patiosACrear = this.componenteEncuesta.patiosACrear.length
    const patiosExistentes = this.componenteEncuesta.encuesta.patios.length

    let totalPatios = patiosExistentes - patiosAEliminar + patiosACrear
    console.log('total patios', totalPatios)
    return totalPatios > 0 ? true : false
  }

  tieneEmpresas(): boolean{
    const empresasAEliminar = this.componenteEncuesta.empresasAEliminar.length
    const empresasACrear = this.componenteEncuesta.empresasACrear.length
    const empresasExistentes = this.componenteEncuesta.encuesta.empresas.length

    let totalEmpresas = empresasExistentes - empresasAEliminar + empresasACrear
    console.log('total empresas', totalEmpresas)
    return totalEmpresas > 0 ? true : false
  }
}
