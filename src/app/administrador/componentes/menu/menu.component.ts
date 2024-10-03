import { Component, OnInit } from '@angular/core';
import { Rol, Submodulo } from 'src/app/autenticacion/modelos/Rol';
import { ServicioLocalStorage } from '../../servicios/local-storage.service';
import { Usuario } from 'src/app/autenticacion/modelos/IniciarSesionRespuesta';
import { AutenticacionService } from 'src/app/autenticacion/servicios/autenticacion.service';
import { Router } from '@angular/router';
import { MenuHeaderPService } from 'src/app/services-menu-p/menu-header-p-service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  rol?: Rol | null;
  usuario?: Usuario | null;
  isCollapsed = false;
  desplegado = true
  //rutaActual: string ='';
  constructor(
    private servicioLocalStorage: ServicioLocalStorage, 
    private servicioAutenticacion: AutenticacionService,
    public router: Router,
    public ServiceMenuP:MenuHeaderPService
  ) { 
    //this.ServiceMenuP.RutaActual =(this.ServiceMenuP.RutaActual==='') ? '/encuesta/1' : this.ServiceMenuP.RutaActual;
    this.ServiceMenuP.RutaModelo =(this.ServiceMenuP.RutaModelo==='') ?`/administrar/encuestas/${1}` : this.ServiceMenuP.RutaActual
    //this.rutaActual=this.router.url;// linea paolo
  }

  ngOnInit(): void {
    this.rol = this.servicioLocalStorage.obtenerRol()
    this.usuario = this.servicioLocalStorage.obtenerUsuario()
    //
  }

  public abrir():void{
    this.desplegado = true
  }

  public cerrar():void{
    this.desplegado = false
  }
  /*** CODIGO DE PAOLO************************************* */
  public SeleccionarMenuP(rutaModelo:string) :boolean
  {
    //console.log(this.ServiceMenuP.RutaModelo);
    //console.log(`/administrar${rutaModelo}`);
    if(this.ServiceMenuP.RutaModelo===`/administrar${rutaModelo}`)
    {
      return true
    }
    return false
  }
  
  /************************************************************ */ 
  public cerrarSesion(){
    this.servicioAutenticacion.cerrarSesion()
    this.router.navigateByUrl('/inicio-sesion')
  }
  imprimirRuta(submodulo: Submodulo){
    console.log(`/administrar${submodulo.ruta}`)
  }

  navegarAlSubmodulo(submodulo: Submodulo){
    this.imprimirRuta(submodulo)
    this.router.navigateByUrl(`/administrar${submodulo.ruta}`)
  }
}
