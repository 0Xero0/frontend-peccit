import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsComponent } from './componentes/tabs/tabs.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TabComponent } from './componentes/tab/tab.component';
import { AcordeonComponent } from './componentes/acordeon/acordeon.component';



@NgModule({
  declarations: [
    TabsComponent,
    TabComponent,
    AcordeonComponent
  ],
  imports: [
    CommonModule,
    NgbModule
  ],
  exports:[
    TabsComponent,
    TabComponent,
    AcordeonComponent
  ]
})
export class NavegacionModule { }
