import { AfterContentChecked, AfterViewChecked, AfterViewInit, Component, OnInit } from '@angular/core';
import { Rol, Submodulo } from 'src/app/autenticacion/modelos/Rol';
import { ServicioLocalStorage } from '../../servicios/local-storage.service';
import { Usuario } from 'src/app/autenticacion/modelos/IniciarSesionRespuesta';
import { AutenticacionService } from 'src/app/autenticacion/servicios/autenticacion.service';
import { Router } from '@angular/router';
import { MenuHeaderPService } from 'src/app/services-menu-p/menu-header-p-service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit,AfterViewInit ,AfterViewChecked{
  rol?: Rol | null;
  usuario?: Usuario | null;
  isCollapsed = false;
  desplegado = true

  inicioSesion: boolean = false
  inicioVigia2: boolean = false

  urlMigaPan:string ="" //paolo
  Marcarmenu:boolean =false //paolo
  rutasMenu:any//paolo
  //rutaActual: string ='';
  constructor(
    private servicioLocalStorage: ServicioLocalStorage,
    private servicioAutenticacion: AutenticacionService,
    public router: Router,
    public ServiceMenuP:MenuHeaderPService
  ) {
    //this.ServiceMenuP.RutaActual =(this.ServiceMenuP.RutaActual==='') ? '/encuesta/1' : this.ServiceMenuP.RutaActual;

    //this.ServiceMenuP.RutaModelo =(this.ServiceMenuP.RutaModelo==='') ?`/administrar/encuestas/${1}` : this.ServiceMenuP.RutaActual
    //this.rutaActual=this.router.url;// linea paolo
  }

  ngOnInit(): void {
    this.rol = this.servicioLocalStorage.obtenerRol()
    this.usuario = this.servicioLocalStorage.obtenerUsuario()
    this.rutasMenu=this.rol?.modulos
    //console.log(this.ServiceMenuP.AsginarRutas(this.router.routerState));
    //this.ServiceMenuP.RutaModelo='/administrar/encuestas/1'
    //this.ActivarMenuP('/encuestas/1',0)
    //console.log('desdeinit')

  }

  public abrir():void{
    this.desplegado = true
  }

  public cerrar():void{
    this.desplegado = false
  }
  /*** CODIGO DE PAOLO************************************* */
  OnQuitarMarcaP()
  {
    let carouselItem = document.querySelector(".ActiveP2");
    carouselItem?.classList.remove('ActiveP2');

  }
  ngAfterContentChecked (){

  }
  ngAfterViewInit()
  {

  }
  ngAfterViewChecked()
  {

    //console.log('desdeinit')
  }
  public SeleccionarMenuP(rutaModelo:string) :boolean
  {
    //console.log(this.ServiceMenuP.RutaModelo);
    //console.log(`/administrar${rutaModelo}`);
    //console.log(this.router.routerState.snapshot.url);
    if(this.ServiceMenuP.RutaModelo===`/administrar${rutaModelo}`)
    {
      //console.log('-----DESDE MENU---------------')
      //console.log(this.ServiceMenuP.RutaModelo)
      //this.ServiceMenuP.RutaModelo=this.router.url
      //console.log('--------------------')
      this.urlMigaPan=this.router.routerState.snapshot.url
      //console.log(this.router.routerState.snapshot.url)
      return true

    }

    return false
  }
  public ActivarMenuP(rutaModelo:string) : boolean
  {
    //console.log(rutaModelo+ 'menup')

    //for (let modulo of this.rutasMenu) {
      if(this.ServiceMenuP.RutaModelo===`/administrar${rutaModelo}`  )
      {
        //this.ServiceMenuP.RutaModelo=`/administrar${modulo.ruta}`
         //console.log('-----DESDE MENU---------------' + item)
         //console.log(this.ServiceMenuP.RutaModelo)
      //this.ServiceMenuP.RutaModelo=this.router.url
         ///console.log('--------------------')
        return true
      }

    //}

    //console.log('-----DESDE MENU FALSO---------------')
    return false
  }
  public MostrarNombrePanP() : string
  {
    let i:number=0
    for (let modulo of this.rutasMenu) {
      if(this.ServiceMenuP.RutaModelo===`/administrar${modulo.ruta}`)
      {
        this.ActivarMenuP(modulo.ruta)
        return modulo.nombre
      }
      i+=1
    }

    //this.ServiceMenuP.RutaModelo='/administrar/encuestas/1'
    //this.router.navigate([this.ServiceMenuP.RutaModelo])
    //this.ActivarMenuP('/encuestas/1',0)
    return 'Información General'
  }

  /************************************************************ */
  public cerrarSesion(){
    /* this.servicioAutenticacion.cerrarSesion()
    this.router.navigateByUrl('/inicio-sesion') */
    if(this.inicioVigia2){
      window.location.href = environment.urlVigia2+'/administrar/administrar-aplicativos'
    }else if(this.inicioSesion){
      this.router.navigateByUrl('/inicio-sesion')
    }
  }
  imprimirRuta(submodulo: Submodulo){
    //console.log(`/administrar${submodulo.ruta}`)
  }

  navegarAlSubmodulo(submodulo: Submodulo){
    this.imprimirRuta(submodulo)
    this.router.navigateByUrl(`/administrar${submodulo.ruta}`)
  }
}
