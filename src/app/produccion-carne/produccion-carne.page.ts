import { Component, OnInit, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';
import { ProduccionService } from '../services/produccion.service';
import { Subscription } from 'rxjs';
import { IonModal } from '@ionic/angular';
import { FormBuilder, Validators } from '@angular/forms';
import { OverlayEventDetail } from '@ionic/core/components';
import { Router } from '@angular/router';

@Component({
  selector: 'app-produccion-carne',
  templateUrl: './produccion-carne.page.html',
  styleUrls: ['./produccion-carne.page.scss'],
})
export class ProduccionCarnePage implements OnInit {
  @ViewChild(IonModal) modal: IonModal;

  peso : any;
  fincaId : any;
  animalId : any;
  carneSub : Subscription;

  form = this.formBuilder.group({
    peso: ['', [Validators.required]],
    fecha: ['', [Validators.required]],
  });

  constructor(private produccionService : ProduccionService,
    private router : Router,
    private formBuilder : FormBuilder) { 

      this.peso = {
        peso: '',
        fecha: ''
      };

     }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.fincaId = localStorage.getItem('id');
    this.animalId = localStorage.getItem('animalId');

    this.crearGrafico();
  }

  ionViewDidLeave() {
    //this.carneSub.unsubscribe();
  }

  crearGrafico() {
    const canvas = document.getElementById('myChart');
    const ctx = (canvas as HTMLCanvasElement).getContext('2d');
    const myChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre','Octubre', 'Noviembre', 'Diciembre'],
        datasets: [{
          label: 'Peso en KG',
          data: [300, 380, 436, 450, 480, 500, 520, 540, 570, 600, 660, 700],
          
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  agregarPeso() {
    this.modal.dismiss(null, 'peso');

    //this.carneSub = this.produccionService.addPeso(this.fincaId, this.animalId, )
  }

}
