import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SaludService } from '../services/salud.service';
import { Salud } from '../interfaces/salud';
import { Subscription } from 'rxjs';
import { IonModal } from '@ionic/angular';
import { FormBuilder, Validators } from '@angular/forms';
import { OverlayEventDetail } from '@ionic/core/components';
import { AlertasService } from '../services/alertas.service';
import { Alertas } from '../interfaces/alertas';
import { AutentificarService } from '../services/autentificar.service';
import { FincaService } from '../services/finca.service';
import { format } from 'date-fns';

@Component({
  selector: 'app-salud',
  templateUrl: './salud.page.html',
  styleUrls: ['./salud.page.scss'],
})
export class SaludPage implements OnInit {
  @ViewChild(IonModal) modal: IonModal;

  historias : Salud[];
  historia : Salud;
  alertas : Alertas;
  fincaId : any;
  animalId : any;
  usuarioId : any;
  animalNombre : any;
  saludSub : Subscription;
  usuarioSub : Subscription;
  fincaSub : Subscription;
  isModalOpen = false;
  isModalOpen2 = false;

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
    private formBuilder : FormBuilder,
    private alertasService : AlertasService,
    private autentificarService : AutentificarService,
    private fincaService : FincaService
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

      this.alertas = {
        usuario: '',
        cambio: '',
        foto: '',
        fecha: ''
      };
    }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.fincaId = localStorage.getItem('id');
    this.animalId = localStorage.getItem('animalId');
    this.usuarioId = localStorage.getItem('usuarioId');
    this.animalNombre = localStorage.getItem('animalNombre');

    this.saludSub = this.saludService.getHistorias(this.fincaId, this.animalId).subscribe(historias => {
      this.historias = historias;
    });

    this.usuarioSub = this.autentificarService.getUsuario(this.usuarioId).subscribe(usuario => {
      this.alertas.usuario = usuario.nombre;
    });

    this.fincaSub = this.fincaService.getFinca(this.fincaId).subscribe(finca => {
      this.alertas.foto = finca.foto;
    });

    this.alertas.fecha = format(new Date(), 'yyyy-MM-dd');
  }

  ionViewDidLeave() {
    this.setOpen(false, 1);
    this.setOpen(false, 2);
    this.saludSub.unsubscribe();
  }

  getId(id : any) {
    localStorage.setItem('saludId', id);
    //console.log(localStorage.getItem('saludId'));
    this.router.navigate(['/historia']);
  }

  tipo() {
    this.historia.ref = this.form.getRawValue().ref;
    this.modal.dismiss(null, 'tipo');
    this.setOpen(false, 1);
    this.setOpen(true, 2);
    //console.log(this.historia);
  }

  setOpen(isOpen : boolean, num : any) {
    if(num == 1) {
      this.isModalOpen = isOpen;
    }
    if(num == 2) {
      this.isModalOpen2 = isOpen;
    }
  }

  crearHistoria() {
    this.historia.nombre = this.form.getRawValue().nombre;
    this.historia.sintomas = this.form.getRawValue().sintomas;
    this.historia.nomCan_med = this.form.getRawValue().nomCan_med;
    this.historia.fecha = this.form.getRawValue().fecha;

    this.alertas.cambio = 'Agrego una ' + this.form.getRawValue().ref + ' a ' + this.animalNombre;

    this.saludService.addHistoria(this.fincaId, this.animalId, this.historia)
    .then(() => {
      this.alertasService.addAlerta(this.alertas, this.fincaId);
    })
    .catch(error => {
      console.log('Error al Crear animal', error);
    });

    this.modal.dismiss(null, "crear");
    this.setOpen(false, 2);
    console.log(this.historia);
  }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'tipo') {
      //console.log("tipo");
      this.form.reset();
    }

    console.log(ev.detail.role);
    if (ev.detail.role === 'crear') {
      //console.log("crear");
      this.form.reset();
      this.historia.ref = '';
      this.historia.nombre = '';
      this.historia.sintomas = '';
      this.historia.nomCan_med = '';
      this.historia.fecha = '';
    }

    if (ev.detail.role === 'backdrop') {
      this.setOpen(false, 1);
      this.setOpen(false, 2);
      //console.log("else");
      this.form.reset();
      this.historia.ref = '';
      this.historia.nombre = '';
      this.historia.sintomas = '';
      this.historia.nomCan_med = '';
      this.historia.fecha = '';
    }
  }
}
