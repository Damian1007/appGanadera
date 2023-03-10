import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { ReproduccionService } from '../services/reproduccion.service';
import { Reproduccion } from '../interfaces/reproduccion';
import { FormBuilder, Validators } from '@angular/forms';
import { IonModal } from '@ionic/angular';
import { format, parseISO } from 'date-fns';
import { OverlayEventDetail } from '@ionic/core/components';

@Component({
  selector: 'app-reproduccion',
  templateUrl: './reproduccion.page.html',
  styleUrls: ['./reproduccion.page.scss'],
})
export class ReproduccionPage implements OnInit {
  @ViewChild(IonModal) modal: IonModal;

  eventos : Reproduccion[];
  evento : Reproduccion;
  fincaId : any;
  animalId : any;
  reproduccionId : any;
  reproduccionesSub : Subscription;
  reproduccionSub : Subscription;

  embarazo = false;
  isModalOpen = false;
  isModalOpen2 = false;
  showPicker = false;
  dateValor = format(new Date(), 'yyyy-MM-dd');
  fechaValor = '';

  form = this.formBuilder.group({
    tipo: ['', [Validators.required]],
    nombre: ['', [Validators.required]],
    fecha: ['', [Validators.required]],
  });

  constructor(
    private reproduccionService : ReproduccionService,
    private formBuilder : FormBuilder
  ) { 
    this.eventos = [{
      tipo: '',
      nombreToro: '',
      fechaMonta: '',
      nombreCria: '',
      fechaPartoProbable: '',
      fechaParto: ''
    }];

    this.evento = {
      id: '',
      tipo: '',
      nombreToro: '',
      fechaMonta: '',
      nombreCria: '',
      fechaPartoProbable: '',
      fechaParto: ''
    };

    this.setTiempo();
  }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.fincaId = localStorage.getItem('id');
    this.animalId = localStorage.getItem('animalId');

    this.reproduccionesSub = this.reproduccionService.getReproducciones(this.fincaId, this.animalId).subscribe(eventos => {
      this.eventos = eventos;

      eventos.forEach(evento => {
        if(evento.tipo == 'Monta') {
          this.embarazo = true;
        }
      });
    });
  }

  ionViewDidLeave() {
    this.reproduccionesSub.unsubscribe();
    this.reproduccionSub.unsubscribe();
  }

  setOpen(isOpen : boolean, num : any) {
    if(num == 1) {
      this.isModalOpen = isOpen;
    }else {
      this.isModalOpen2 = isOpen;
    }
  }

  getId(id : any) {
    this.reproduccionSub = this.reproduccionService.getReproduccion(this.fincaId, this.animalId, id).subscribe(evento => {
      this.evento = evento;
      //console.log(evento);
      this.evento.id = id;

      this.setOpen(true, 1);
    });
  }

  // <!----------------------------------- Configuración de Fecha ------------------------------------------->
  setTiempo() {
    this.fechaValor = format(parseISO(format(new Date(), 'yyyy-MM-dd')), 'yyyy/MM/dd');
  }

  tiempoChange(value: any) {
    this.dateValor = value;
    this.fechaValor = format(parseISO(value), 'yyyy/MM/dd');
    this.showPicker = false;
  }
  // <!------------------------------------------------------------------------------------------------------>

  agregarMonta() {
    if (this.embarazo) {
      console.log("Ya preñada");
    }else {
      this.evento.tipo = 'Monta';
      this.evento.nombreToro = this.form.getRawValue().nombre;
      this.evento.fechaMonta = this.fechaValor;

      this.modal.dismiss(null, 'monta');

      this.reproduccionService.addReproduccion(this.fincaId, this.animalId, this.evento);
    }
  }

  registrarParto() {
    this.modal.dismiss(null, 'monta_parto');
    this.setOpen(false, 1);
    this.setOpen(true, 2);
  }

  agregarParto() {
    this.evento.tipo = 'Parto';
    this.evento.fechaParto = this.fechaValor;
    this.evento.nombreCria = this.form.getRawValue().nombre;

    this.modal.dismiss(null, 'parto');
    this.setOpen(false, 2);

    this.reproduccionService.updateReproduccion(this.evento, this.fincaId, this.animalId)
  }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'monta') {
      console.log(this.evento);
      this.form.reset();
    }

    console.log(ev.detail.role);
    if (ev.detail.role === 'monta_parto') {
      console.log(this.evento);
      this.form.reset();
    }

    if (ev.detail.role === 'parto') {
      console.log(this.evento);
      this.form.reset();
    }

    if (ev.detail.role === 'backdrop') {
      //console.log(this.evento);
      this.setOpen(false, 1);
      this.setOpen(false, 2);
      this.form.reset();
    }
  }
}
