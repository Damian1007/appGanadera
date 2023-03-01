import { Component, OnInit, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';
import { ProduccionService } from '../services/produccion.service';
import { Subscription } from 'rxjs';
import { IonModal } from '@ionic/angular';
import { FormBuilder, Validators } from '@angular/forms';
import { OverlayEventDetail } from '@ionic/core/components';
import { Router } from '@angular/router';
import { format, parseISO } from 'date-fns';
import { Pesaje } from '../interfaces/pesaje';

@Component({
  selector: 'app-produccion-carne',
  templateUrl: './produccion-carne.page.html',
  styleUrls: ['./produccion-carne.page.scss'],
})
export class ProduccionCarnePage implements OnInit {
  @ViewChild(IonModal) modal: IonModal;

  pesaje : Pesaje;
  fincaId : any;
  animalId : any;
  graficaSub : Subscription;

  showPicker = false;
  dateValor = format(new Date(), 'yyyy-MM-dd');
  fechaValor = '';
  pesoArray : any[];
  fechaArray : any[];

  form = this.formBuilder.group({
    peso: ['', [Validators.required]],
    fecha: [''],
  });

  constructor(private produccionService : ProduccionService,
    private router : Router,
    private formBuilder : FormBuilder) { 

      this.pesaje = {
        peso: '',
        fecha: ''
      };

      this.setTiempo();

     }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.fincaId = localStorage.getItem('id');
    this.animalId = localStorage.getItem('animalId');
    this.pesoArray = [];
    this.fechaArray = [];

    this.graficaSub = this.produccionService.getPesajes(this.fincaId, this.animalId).subscribe(pesajes => {
      pesajes.forEach(pesaje => {
        this.pesoArray.push(pesaje.peso);
        this.fechaArray.push(pesaje.fecha);
      });
      //console.log(this.pesoArray, this.fechaArray);
      this.crearGrafico();
    });

    
  }

  ionViewDidLeave() {
    this.graficaSub.unsubscribe();
  }


  // <!----------------------------------- Configuración de Fecha ------------------------------------------->
  setTiempo() {
    this.fechaValor = format(parseISO(format(new Date(), 'yyyy-MM-dd')), 'dd/MM/yyyy');
  }

  tiempoChange(value: any) {
    this.dateValor = value;
    this.fechaValor = format(parseISO(value), 'dd/MM/yyyy');
    this.showPicker = false;
  }
  // <!------------------------------------------------------------------------------------------------------>


  agregarPeso() {
    this.form.setValue({peso : this.form.getRawValue().peso, fecha : this.fechaValor});
    console.log(this.form.getRawValue());

    this.pesaje.peso = this.form.getRawValue().peso
    this.pesaje.fecha = this.form.getRawValue().fecha

    this.modal.dismiss(null, 'peso');

    this.produccionService.addPeso(this.fincaId, this.animalId, this.pesaje);
  }

  crearGrafico() {
    const canvas = document.getElementById('myChart');
    const ctx = (canvas as HTMLCanvasElement).getContext('2d');
    const myChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.fechaArray,
        datasets: [{
          label: 'Peso en KG',
          data: this.pesoArray,
          
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

}
