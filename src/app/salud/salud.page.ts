import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SaludService } from '../services/salud.service';
import { Salud } from '../interfaces/salud';
import { Subscription } from 'rxjs';
import { IonModal } from '@ionic/angular';
import { FormBuilder, Validators } from '@angular/forms';
import { OverlayEventDetail } from '@ionic/core/components';

@Component({
  selector: 'app-salud',
  templateUrl: './salud.page.html',
  styleUrls: ['./salud.page.scss'],
})
export class SaludPage implements OnInit {
  @ViewChild(IonModal) modal: IonModal;

  historias : Salud[];
  historia : Salud;
  fincaId : any;
  animalId : any;
  saludSub : Subscription;
  isModalOpen = false;

  form = this.formBuilder.group({
    ref: ['', [Validators.required]],
    nombre: ['', [Validators.required]],
    sintomas: ['', [Validators.required]],
    nomCan_med: ['', [Validators.required]],
    fecha: ['', [Validators.required]],
  });

  constructor( 
    private saludService : SaludService,
    private router : Router,
    private formBuilder : FormBuilder
  ) { 
      this.historias = [{
        id: '',
        ref: '',
        nombre: '',
        sintomas: '',
        nomCan_med: '',
        fecha: ''
      }];

      this.historia = {
        ref: '',
        nombre: '',
        sintomas: '',
        nomCan_med: '',
        fecha: ''
      };
    }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.fincaId = localStorage.getItem('id');
    this.animalId = localStorage.getItem('animalId');

    this.saludSub = this.saludService.getHistorias(this.fincaId, this.animalId).subscribe(historias => {
      this.historias = historias;
    });
  }

  ionViewDidLeave() {
    this.saludSub.unsubscribe();
  }

  getId(id : any) {
    localStorage.setItem('saludId', id);
    console.log(localStorage.getItem('saludId'));
  }

  tipo() {
    this.historia.ref = this.form.getRawValue().ref;
    this.modal.dismiss(null, 'tipo');
    //console.log(this.historia);
  }

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

  crearHistoria() {
    this.historia.nombre = this.form.getRawValue().nombre;
    this.historia.sintomas = this.form.getRawValue().sintomas;
    this.historia.nomCan_med = this.form.getRawValue().nomCan_med;
    this.historia.fecha = this.form.getRawValue().fecha;

    this.saludService.addHistoria(this.fincaId, this.animalId, this.historia);

    this.modal.dismiss(null, "crear");
    console.log(this.historia);
  }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'tipo') {
      console.log("tipo");
      this.form.reset();
    }

    //console.log(ev.detail.role);
    if (ev.detail.role === 'crear') {
      console.log("crear");
      this.form.reset();
      this.historia.ref = '';
      this.historia.nombre = '';
      this.historia.sintomas = '';
      this.historia.nomCan_med = '';
      this.historia.fecha = '';
    }

    
    if (ev.detail.role === 'backdrop') {
      console.log("else");
      this.form.reset();
      this.historia.ref = '';
      this.historia.nombre = '';
      this.historia.sintomas = '';
      this.historia.nomCan_med = '';
      this.historia.fecha = '';
    }
  }
}
