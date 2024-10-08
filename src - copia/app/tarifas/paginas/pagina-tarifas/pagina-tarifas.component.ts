import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FormularioTarifa } from '../../modelos/FormularioTarifa';
import { ServicioTarifas } from '../../servicios/tarifas.service';
import { ServicioArchivos } from 'src/app/archivos/servicios/archivos.service';
import { Usuario } from 'src/app/autenticacion/modelos/IniciarSesionRespuesta';
import { ServicioLocalStorage } from 'src/app/administrador/servicios/local-storage.service';
import { ErrorAutorizacion } from 'src/app/errores/ErrorAutorizacion';
import { marcarFormularioComoSucio } from 'src/app/administrador/utilidades/Utilidades';
import { PopupComponent } from 'src/app/alertas/componentes/popup/popup.component';
import { DateTime } from 'luxon';
import { FiltrosTarifas } from '../../modelos/FiltrosTarifas';
import { Observable } from 'rxjs';
import { Paginacion } from 'src/app/compartido/modelos/Paginacion';
import { Tarifa } from '../../modelos/Tarifa';
import { Paginador } from 'src/app/administrador/modelos/compartido/Paginador';
import { MenuHeaderPService } from 'src/app/services-menu-p/menu-header-p-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pagina-tarifas',
  templateUrl: './pagina-tarifas.component.html',
  styleUrls: ['./pagina-tarifas.component.css']
})
export class PaginaTarifasComponent implements OnInit{
  @ViewChild('popup') popup!: PopupComponent
  soloLectura: boolean
  idVigilado: string

  constructor(private servicioLocalStorage: ServicioLocalStorage,
    private router: Router,
    private ServiceMenuP:MenuHeaderPService
  ) {
    this.soloLectura = false
    const usuario = this.servicioLocalStorage.obtenerUsuario()
    const rol = this.servicioLocalStorage.obtenerRol()
    if(!usuario || !rol) throw new ErrorAutorizacion();
    this.idVigilado = usuario.usuario
    this.soloLectura = rol.id !== '003' ? true : false;
    this.ServiceMenuP.AsginarRutas(this.router.url,this.router.url); ///paolo
  }

  ngOnInit(): void {
   
  }

}
