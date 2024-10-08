import { Component, ElementRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CausasModal } from 'src/app/compartido/CausasModal';

@Component({
  selector: 'app-modal-confirmacion',
  templateUrl: './modal-confirmacion.component.html',
  styleUrls: ['./modal-confirmacion.component.css']
})
export class ModalConfirmacionComponent {
  @ViewChild('modal', { static: true }) modal!: ElementRef;

  constructor(private servicioModal: NgbModal) { 
  }

  abrir({alAceptar, alCancelar}: {alAceptar: Function, alCancelar: Function}){
    this.servicioModal.open(this.modal, { centered: true, size: 'md' }).result.then(
      (_) => {},
      (reason) => {
        console.log(reason);
        if(reason === CausasModal.ACEPTAR){
          alAceptar();
        }else if(reason === CausasModal.CANCELAR){
          alCancelar();
        }
      }
    );
  }

  aceptar(){
    this.servicioModal.dismissAll(CausasModal.ACEPTAR);
  }

  cerrar(){
    this.servicioModal.dismissAll(CausasModal.CANCELAR);
  }

}
