import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { IniciarSesionRespuesta } from '../../modelos/IniciarSesionRespuesta';
import { AutenticacionService } from '../../servicios/autenticacion.service';
import { ModalRecuperacionContrasenaComponent } from '../modal-recuperacion-contrasena/modal-recuperacion-contrasena.component';
import { environment } from 'src/environments/environment';
import { PopupComponent } from 'src/app/alertas/componentes/popup/popup.component';
import { MenuHeaderPService } from 'src/app/services-menu-p/menu-header-p-service';

@Component({
  selector: 'app-inicio-sesion',
  templateUrl: './inicio-sesion.component.html',
  styleUrls: ['./inicio-sesion.component.css']
})
export class InicioSesionComponent implements OnInit {
  @ViewChild('modalRecuperacion') modalRecuperacion!: ModalRecuperacionContrasenaComponent
  @ViewChild('popup') popup!: PopupComponent
  public formulario: FormGroup
  public readonly llaveCaptcha = environment.llaveCaptcha


  constructor(private servicioAutenticacion: AutenticacionService, private enrutador: Router, public ServiceMenuP:MenuHeaderPService) {
    this.formulario = new FormGroup({
      usuario: new FormControl('', [Validators.required,Validators.minLength(6)]),
      clave: new FormControl('', [Validators.required]),
      captcha: new FormControl(undefined, [Validators.required])
    })
  }

  ngOnInit(): void {
  }

  public iniciarSesion(): void {
    if (this.formulario.invalid) {
      this.marcarFormularioComoSucio()
      return;
    }
    this.servicioAutenticacion.iniciarSesion(
      this.formulario.controls['usuario'].value.toString(),
      this.formulario.controls['clave'].value,
    ).subscribe({
      next: (respuesta: IniciarSesionRespuesta) => {
        this.servicioAutenticacion.guardarInformacionInicioSesion(
          respuesta.token,
          respuesta.rol,
          respuesta.usuario
        )
        if (respuesta.claveTemporal === true) {
          this.enrutador.navigateByUrl('/actualizar-contrasena')
        } else {
          if(respuesta.rol.modulos.length > 0){
            if(!respuesta.rol.modulos[0].ruta && respuesta.rol.modulos[0].submodulos.length > 0){
              //this.ServiceMenuP.RutaModelo =`/administrar/encuestas/${1}`
              //this.ServiceMenuP.RutaModelo =`/encuestas/${1}`
              
              //localStorage.setItem("miRutaP", this.ServiceMenuP.RutaModelo);
              this.enrutador.navigateByUrl(`/administrar${respuesta.rol.modulos[0].submodulos[0].ruta}`);
            }else{
              //this.ServiceMenuP.RutaModelo =`/administrar/encuestas/${1}`
                //this.ServiceMenuP.RutaModelo =`/encuestas/${1}`
             //localStorage.setItem("miRutaP", this.ServiceMenuP.RutaModelo);
              this.enrutador.navigateByUrl(`/administrar${respuesta.rol.modulos[0].ruta}`);
              
              
            }
          }
          else{
            this.enrutador.navigateByUrl(`/administrar`);
          }
        }
      },

      error: (error: HttpErrorResponse) => {
        if (error.status == 423) {
          this.abrirModalRecuperacion()
          this.popup.abrirPopupFallido('Error al iniciar sesión', error.error.message)
        }
        if (error.status == 400) {
          this.popup.abrirPopupFallido('Error al iniciar sesión', error.error.message)
        }
      }
    })
  }

  public abrirModalRecuperacion(): void {
    this.modalRecuperacion.abrir()
  }

  public marcarFormularioComoSucio(): void {
    (<any>Object).values(this.formulario.controls).forEach((control: FormControl) => {
      control.markAsDirty();
      if (control) {
        control.markAsDirty()
      }
    });
  }
}
