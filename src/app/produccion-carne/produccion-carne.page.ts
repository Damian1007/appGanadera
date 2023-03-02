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
import { clearCanvas } from 'chart.js/dist/helpers/helpers.canvas';

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
  myChart : Chart

  showPicker = false;
  dateValor = format(new Date(), 'yyyy-MM-dd');
  fechaValor = '';
  pesajesArray : any[];
  label : any[];
  data : any[];

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
    
    this.mostrarGrafico();
  }

  ionViewDidLeave() {
    this.graficaSub.unsubscribe();
  }

  mostrarGrafico() {
    this.pesajesArray = [];
    this.label = [];
    this.data = [];

    this.graficaSub = this.produccionService.getPesajes(this.fincaId, this.animalId).subscribe(pesajes => {
      pesajes.forEach(pesaje => {
        
        this.pesajesArray.push(
          {peso : pesaje.peso, fecha : pesaje.fecha}
        );

      });

      this.pesajesArray.sort(function (a, b) {
        if (a.fecha > b.fecha) {
          return 1;
        }

        if (a.fecha < b.fecha) {
          return -1;
        }
        
        // a must be equal to b
        return 0;
      });

      this.pesajesArray.forEach(p => {
        this.label.push(p.fecha);
        this.data.push(p.peso);
      });

      this.crearGrafico();
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


  async agregarPeso() {
    this.form.setValue({peso : this.form.getRawValue().peso, fecha : this.fechaValor});
    //console.log(this.form.getRawValue());

    this.pesaje.peso = this.form.getRawValue().peso
    this.pesaje.fecha = this.form.getRawValue().fecha

    this.modal.dismiss(null, 'peso');
    this.graficaSub.unsubscribe();

    this.myChart.destroy();
    await this.produccionService.addPeso(this.fincaId, this.animalId, this.pesaje);

    this.mostrarGrafico();
  }

  crearGrafico() {
    const canvas = document.getElementById('myChart');
    const ctx = (canvas as HTMLCanvasElement).getContext('2d');
    this.myChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.label,
        datasets: [{
          label: 'Peso en KG',
          data: this.data,
          
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
