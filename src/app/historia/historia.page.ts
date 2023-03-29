import { Component, OnInit, ViewChild } from '@angular/core';
import { SaludService } from '../services/salud.service';
import { Salud } from '../interfaces/salud';
import { Subscription } from 'rxjs';
import { IonModal } from '@ionic/angular';
import { FormBuilder, Validators } from '@angular/forms';
import { OverlayEventDetail } from '@ionic/core/components';

@Component({
  selector: 'app-historia',
  templateUrl: './historia.page.html',
  styleUrls: ['./historia.page.scss'],
})
export class HistoriaPage implements OnInit {
  @ViewChild(IonModal) modal: IonModal;
  
  historia : Salud;
  fincaId : any;
  animalId : any;
  saludId : any;
  saludSub : Subscription;

  form = this.formBuilder.group({
    ref: ['', [Validators.required]],
    nombre: ['', [Validators.required]],
    sintomas: ['', [Validators.required]],
    nomCan_med: ['', [Validators.required]],
    fecha: ['', [Validators.required]],
  });

  constructor( 
    private saludService : SaludService,
    private formBuilder : FormBuilder
  ) { 
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
    this.saludId = localStorage.getItem('saludId');

    this.saludSub = this.saludService.getHistoria(this.fincaId, this.animalId, this.saludId).subscribe(historia => {
      this.historia = historia;
    });
  }

  ionViewDidLeave() {
    this.saludSub.unsubscribe();
  }
}
