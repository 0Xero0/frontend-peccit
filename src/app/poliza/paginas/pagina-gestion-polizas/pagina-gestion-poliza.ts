import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ServicioArchivos } from 'src/app/archivos/servicios/archivos.service';
import { Usuario } from 'src/app/autenticacion/modelos/IniciarSesionRespuesta';
import { ServicioLocalStorage } from 'src/app/administrador/servicios/local-storage.service';
import { ErrorAutorizacion } from 'src/app/errores/ErrorAutorizacion';
import { marcarFormularioComoSucio } from 'src/app/administrador/utilidades/Utilidades';
import { PopupComponent } from 'src/app/alertas/componentes/popup/popup.component';
import { DateTime } from 'luxon';

import { Observable } from 'rxjs';
import { Paginacion } from 'src/app/compartido/modelos/Paginacion';

import { Paginador } from 'src/app/administrador/modelos/compartido/Paginador';
import { MenuHeaderPService } from 'src/app/services-menu-p/menu-header-p-service';
import { Router } from '@angular/router';
import { EmpresaPModel, FiltrarPolizas, ModalidadesPModel, PolizaPModel, TipoBuscarPModel } from '../../modelo/polizaInterface';
import { ServicioPoliza } from '../../servicio/serviciopoliza.service';

@Component({
  selector: 'app-pagina-gestion-poliza',
  templateUrl: './pagina-gestion-poliza.component.html',
  styleUrls: ['./pagina-gestion-poliza.component.css']
})
export class PaginaGestionPolizaComponent implements OnInit{
  @ViewChild('popup') popup!: PopupComponent
  soloLectura: boolean
  idVigilado: string

  constructor(private servicioLocalStorage: ServicioLocalStorage,
    private router: Router,
    private ServiceMenuP:MenuHeaderPService,
    private ServicioPolizaP:ServicioPoliza
  ) {
    this.soloLectura = false
    const usuario = this.servicioLocalStorage.obtenerUsuario()
    const rol = this.servicioLocalStorage.obtenerRol()
    if(!usuario || !rol) throw new ErrorAutorizacion();
    this.idVigilado = usuario.usuario   
    this.ServiceMenuP.AsginarRutas(this.router.url,this.router.url); ///paolo
    //this.paginador = new Paginador<FiltrarPolizas>(this.obtenerPolizas)
  }
 
   /**codigo de paolo */
  ///arreglo de las modalidades, debe venir desde una ruta del servidor
  public modalidadesP: Array<ModalidadesPModel> = [
    {nombre: 'descr 1', id: 1},
    {nombre: "descr 2", id: 2},
    {nombre: "descr 3", id: 3}
  ]; 

  public TipoBuscarP: Array<TipoBuscarPModel> = [
    {nombre: 'Buscar por NIT', id: 1},
    {nombre: 'Buscar por razón social', id: 2},
    {nombre: "Buscar por modalidad", id: 3},
    {nombre: "Buscar por cumplimiento de póliza", id: 4}
  ];
   
  public ListadoEmpresaP:Array<EmpresaPModel>=[  ]

  TipoActual:number=1;
  txtBuscarEmpresaP:string ="";
  txtBuscarPolizaP:string ="";
  istxtVacioEmpresa:boolean=true;/**para la busqueda de la empresa */
  istxtVacioPoliza:boolean=true;/**para la busqueda de la poliza */
  isVisiblePoliza:boolean=true; /**para mostrar la tabla poliza */
  isVisibleDetallePoliza:boolean=true; /**para mostrar la tabla detalle poliza */
  
  UsuarioActual?:string = this.servicioLocalStorage.obtenerUsuario()?.usuario 

  ngOnInit(): void {
    //console.log(this.servicioLocalStorage.obtenerUsuario())
    this.ListarTablaEmpresa('',this.UsuarioActual!,this.PagEmpresaActual,this.NPaginaMostrar)
    
  }

  
  CambiarPaginaEmpresa(paginaActual:number)
  {
    this.PagEmpresaActual=paginaActual;
    this.PagAnteriorEmpresa=((this.PagEmpresaActual - 1) <1) ? 1: this.PagEmpresaActual -1
    this.PagSiguienteEmpresa=((this.PagEmpresaActual + 1) >= this.PagFinalEmpresa) ? this.PagFinalEmpresa: this.PagEmpresaActual  + 1
    this.ListarTablaEmpresa(this.txtBuscarEmpresaP,this.UsuarioActual!,this.PagEmpresaActual,this.NPaginaMostrar)

  }


  ListarTablaEmpresa(txtbuscar:string,usuario:string,pag_inicio:number,numero_items:number)
  {
    this.IsFilaBgItem=-1 /**este es pintar la de empresa */
    this.ListadoEmpresaP=[]
    this.ServicioPolizaP.obtenerListadodeEmpresaP(txtbuscar,usuario,pag_inicio,numero_items).subscribe({
      next: (respuesta) => {  

        this.PagEmpresaActual=respuesta.meta.current_page     
        this.PagInicioEmpresa= respuesta.meta.first_page;
        this.PagFinalEmpresa=respuesta.meta.last_page;
        this.PagAnteriorEmpresa=((this.PagEmpresaActual - 1) < 1) ? 1: this.PagEmpresaActual - 1
        this.PagSiguienteEmpresa=((this.PagEmpresaActual + 1) >= this.PagFinalEmpresa) ? this.PagFinalEmpresa: this.PagEmpresaActual  + 1       
        this.ListarPaginadorEmpresa()
        for (let data of respuesta.data){
          this.ListadoEmpresaP.push(
            { 
              nit: data.nit, 
              razon_social: data.razon_social, 
              modalidad: ` ${data.tipo_servicio} - ${data.smo_nombre} ` , 
              departamento: data.departamento_nombre, 
              municipio: data.ciudad_nombre, 
              capacidadTA: data.capacidad_transportadora_a, 
              capacidadTB: data.capacidad_transportadora_b,
              capacidadTC: data.capacidad_transportadora_c,
              estado:data.poliza },
          )
          
           //console.log(numero);
         } 
        //console.log(respuesta)
         
        //this.modalidadesP= this.modalidadesP.filter(0=0).
        //console.log(this.modalidadesP)
      } 
    })
  }
  EstadoEmpresa(estado: boolean): string
  {
     if(estado)
     {
        return 'CUMPLE';
     }
     return 'NO CUMPLE';
  }
  HabilitarAnteriorEmpresa():boolean
  {
    return  (this.PagEmpresaActual==1) ? true :false;
  }
  HabilitarSiguienteEmpresa():boolean
  {
    return  (this.PagFinalEmpresa==1 || this.PagFinalEmpresa==this.PagEmpresaActual ) ? true :false;
  }
  IsFilaBgItem:number=-1
  BgFilaActivaEmpresa(fila:number): boolean
  {
      
    return (this.IsFilaBgItem==fila) ? true : false
  }
  PagEmpresaActual:number=1;
  PagInicioEmpresa:number=1;
  PagFinalEmpresa:number=1;
  NPaginaMostrar:number=5;
  PagAnteriorEmpresa:number=1
  PagSiguienteEmpresa:number=1
  ListadoPaginaEmpresa:any
  ListarPaginadorEmpresa()
  {
    var min=(this.PagEmpresaActual) -  1;
    min=(min <=0)? 1 : min;
    var max:number =(min + 3) < this.PagFinalEmpresa ? (min + 3) : this.PagFinalEmpresa ;
    min=( this.PagFinalEmpresa - min >= 4) ? min :  this.PagFinalEmpresa - 3 ; 
    min=(min <=0)? 1 : min;
    var List = new Array();
    //console.log(min + ' -> '+ max)
    for (let index = min; index <= max; index++) {
      //const element = array[index];
      //console.log(index)
      var length = List.push(index);
      
    }
    this.ListadoPaginaEmpresa = List;
  }
  /** */
  consultarPoliza(valorB:string,tipoB:string)
  {

  }
  PrecionaTeclaEmpresa(texto: string)
  {
    if(this.txtBuscarEmpresaP.length==0)
    {
      this.istxtVacioEmpresa=false;
    }else{
      this.istxtVacioEmpresa=true;
    }
  }
 
  
  bBuscarEmpresa()
  {
    this.PagEmpresaActual=1;
    this.ListarTablaEmpresa(this.txtBuscarEmpresaP,this.UsuarioActual!,this.PagEmpresaActual,this.NPaginaMostrar)
    this.isVisiblePoliza=true;     
  }
  bLimpiarEmpresa()
  {
    this.txtBuscarEmpresaP="";
    this.PagEmpresaActual=1;
    this.ListarTablaEmpresa(this.txtBuscarEmpresaP,this.UsuarioActual!,this.PagEmpresaActual,this.NPaginaMostrar)
    this.isVisiblePoliza=true;     
  }
  BuscarRegistroPolizaEmpresa(nit: string, fila:number)
  {
    this.IsFilaBgItem=fila 
    this.NitBuscasquedaPoliza=nit
    
    this.ListarTablaPoliza(this.txtBuscarPolizaP,this.NitBuscasquedaPoliza!,this.PagPolizaActual,this.NPaginaMostrar)
    
    this.isVisiblePoliza=false;
  }
/***INFORMACION DE POLIZA *********************************************************************************************************** */
  TotalVehiculoActivo:number=0
  TotalPolizaContractuales:number=0
  TotalExtraPolizaContractuales:number=0
  IsFilaBgItemPoliza:number=-1
  BgFilaActivaPoliza(fila:number): boolean
  {
      
    return (this.IsFilaBgItemPoliza==fila) ? true : false
  }
  public ListadoPolizaP:Array<PolizaPModel>=[]
  NitBuscasquedaPoliza:string =''
  EstadoPoliza(estado: boolean): string
  {
     if(estado)
     {
        return 'ACTIVA';
     }
     return 'NO ACTIVA';
  }
  HabilitarAnteriorPoliza():boolean
  {
    
    return  (this.PagPolizaActual==1) ? true :false;
  }
  HabilitarSiguientePoliza():boolean
  {
    return  (this.PagFinalPoliza==1 || this.PagFinalPoliza==this.PagPolizaActual ) ? true :false;
  }
  PagPolizaActual:number=1;
  PagInicioPoliza:number=1;
  PagFinalPoliza:number=1;  
  PagAnteriorPoliza:number=1
  PagSiguientePoliza:number=1
  ListadoPaginaPoliza:any
  ListarPaginadorPoliza()
  {
    var min=(this.PagPolizaActual) - 1;
    min=(min <=0)? 1 : min;
    
    var max:number =(min + 3) < this.PagFinalPoliza ? (min + 3) : this.PagFinalPoliza ;
    min=( this.PagFinalPoliza - min >= 4) ? min :  this.PagFinalPoliza - 3 ; 
    min=(min <=0)? 1 : min;
    var List = new Array();
    console.log(min + ' -> '+ max)
    console.log( this.PagFinalPoliza)
    for (let index = min; index <= max; index++) {
      //const element = array[index];
      //console.log(index)
      var length = List.push(index);
      
    }
    this.ListadoPaginaPoliza = List;
  }

  CambiarPaginaPoliza(paginaActual:number)
  {
    this.PagPolizaActual=paginaActual;
    this.PagAnteriorPoliza=((this.PagPolizaActual - 1) <1) ? 1: this.PagPolizaActual -1
    this.PagSiguientePoliza=((this.PagPolizaActual + 1) >= this.PagFinalPoliza) ? this.PagFinalPoliza: this.PagPolizaActual  + 1
    this.ListarTablaPoliza(this.txtBuscarPolizaP,this.NitBuscasquedaPoliza!,this.PagPolizaActual,this.NPaginaMostrar)

  }

  ListarTablaPoliza(txtbuscar:string,usuario:string,pag_inicio:number,numero_items:number)
  {
    this.ListadoPolizaP=[]
    this.IsFilaBgItemPoliza=-1
    usuario='72198326'; //se debe quitar despues de probar
    this.ServicioPolizaP.obtenerListadodePolizaxEmpresaP(txtbuscar,usuario,pag_inicio,numero_items).subscribe({
      //this.ServicioPolizaP.obtenerListadodePolizaxEmpresaP('','72198326',2,5).subscribe({
        next: (respuesta) => {  
          
          this.PagPolizaActual=respuesta.out.page     
          //this.PagInicioPoliza= respuesta.meta.first_page;
          this.PagFinalPoliza=respuesta.out.totalPages;
          this.PagAnteriorPoliza=((this.PagPolizaActual - 1) < 1) ? 1: this.PagPolizaActual - 1
          this.PagSiguientePoliza=((this.PagPolizaActual + 1) >= this.PagFinalPoliza) ? this.PagFinalPoliza: this.PagPolizaActual  + 1        
          this.ListarPaginadorPoliza()
          this.TotalVehiculoActivo=respuesta.out.totalVehiculos//respuesta.out.
          this.TotalPolizaContractuales=respuesta.out.totalPolizasContractuales
          this.TotalExtraPolizaContractuales=respuesta.out.totalPolizasExcontractuales
          for (let data of respuesta.out.data){
            this.ListadoPolizaP.push(
              { 
                id: data.pol_id,
                tipo_poliza: data.tpo_descripcion,
                tipo_poliza_id:data.pol_tipo_poliza_id,
                n_poliza: data.pol_numero,
                estado: data.pol_estado,
                fecha_cargue: data.pol_creado,
                v_fecha_inicio: data.pol_inicio_vigencia,
                v_fecha_final: data.pol_fin_vigencia,
                aseguradora:data.ase_nombre,
                cantidad_vehiculo: data.vehiculos_asociados
              }
            )
            
          } 
          console.log(respuesta.out)
           
          //this.modalidadesP= this.modalidadesP.filter(0=0).
          //console.log(this.modalidadesP)
        } 
      })
  }

  bBuscarPoliza()
  {
    
    this.PagPolizaActual=1;
    this.ListarTablaPoliza(this.txtBuscarPolizaP,this.NitBuscasquedaPoliza!,this.PagPolizaActual,this.NPaginaMostrar)
     console.log(this.txtBuscarPolizaP)
      
  }
  bLimpiarPoliza()
  {
    this.txtBuscarPolizaP="";
    this.PagPolizaActual=1;
    this.ListarTablaPoliza(this.txtBuscarPolizaP,this.NitBuscasquedaPoliza!,this.PagPolizaActual,this.NPaginaMostrar)
  }
  PrecionaTeclaPoliza(texto: string)
  {
    if(this.txtBuscarPolizaP.length==0)
    {
      this.istxtVacioPoliza=false;
    }else{
      this.istxtVacioPoliza=true;
    }
  }
  BuscarRegistroPoliza(numeropoliza: string, tipopoliza:number, fila:number)
  {
    this.IsFilaBgItemPoliza=fila
    console.log(numeropoliza)
    console.log(tipopoliza)
    this.isVisibleDetallePoliza=false;
  }
  

/*** FIN DE CODIGO POLIZA */

  CambiarTipoBusqueda(event:any)
  {
    this.TipoActual=event.target.value
    
  }

  

}
