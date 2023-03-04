import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { ReproduccionService } from '../services/reproduccion.service';
import { Reproduccion } from '../interfaces/reproduccion';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { IonModal } from '@ionic/angular';

@Component({
  selector: 'app-reproduccion',
  templateUrl: './reproduccion.page.html',
  styleUrls: ['./reproduccion.page.scss'],
})
export class ReproduccionPage implements OnInit {
  @ViewChild(IonModal) modal: IonModal;

  eventos : Reproduccion[];
  fincaId : any;
  animalId : any;
  reproduccionSub : Subscription;

  form = this.formBuilder.group({
    tipo: ['', [Validators.required]],
    nombre: ['', [Validators.required]],
    fecha: ['', [Validators.required]],
  });

  constructor(
    private reproduccionService : ReproduccionService,
    private router : Router,
    private formBuilder : FormBuilder
  ) { 
    this.eventos = [{
      id: '',
      tipo: '',
      nombre: '',
      fecha: ''
    }];
   }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.fincaId = localStorage.getItem('id');
    this.animalId = localStorage.getItem('animalId');

    this.reproduccionSub = this.reproduccionService.getReproducciones(this.fincaId, this.animalId).subscribe(eventos => {
      this.eventos = eventos;
    });
  }

  ionViewDidLeave() {
    this.reproduccionSub.unsubscribe();
  }

  agregarEvento() {

  }

}
