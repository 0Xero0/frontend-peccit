import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopupComponent } from './componentes/popup/popup.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { AlertaComponent } from './componentes/alerta/alerta.component';
import { ValidacionComponent } from './componentes/validacion/validacion.component';
import { LoadingComponent } from './componentes/loading/loading.component';
import { NotificacionComponent } from './componentes/notificacion/notificacion.component';



@NgModule({
  declarations: [
    PopupComponent,
    AlertaComponent,
    ValidacionComponent,
    LoadingComponent,
    NotificacionComponent,
  ],
  imports: [
    CommonModule,
    SweetAlert2Module.forRoot()
  ],
  exports:[
    PopupComponent,
    AlertaComponent,
    ValidacionComponent,
    LoadingComponent
  ]
})
export class AlertasModule { }
