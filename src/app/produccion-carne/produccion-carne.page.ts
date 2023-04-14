import { Component, OnInit, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';
import { ProduccionService } from '../services/produccion.service';
import { Subscription } from 'rxjs';
import { IonModal } from '@ionic/angular';
import { FormBuilder, Validators } from '@angular/forms';
import { OverlayEventDetail } from '@ionic/core/components';
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
  myChart : Chart;

  isModalOpen = false;
  isModalOpen2 = false;
  isSubmitted = false;
  fechaValor = '';
  pesajesArray : any[];
  label : any[];
  data : any[];

  form = this.formBuilder.group({
    peso: ['', [Validators.required, Validators.pattern('[0-9]+')]],
    fecha: [''],
  });

  constructor(private produccionService : ProduccionService,
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
    this.myChart.destroy();
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

  setOpen(isOpen : boolean, num : any) {
    if(num == 1) {
      this.isModalOpen = isOpen;
    }
    if(num == 2) {
      this.isModalOpen2 = isOpen;
    }
  }

  // <!----------------------------------- Configuración de Fecha ------------------------------------------->
  setTiempo() {
    this.fechaValor = format(parseISO(format(new Date(), 'yyyy-MM-dd')), 'yyyy/MM/dd');
  }

  tiempoChange(value: any) {
    this.fechaValor = format(parseISO(value), 'yyyy/MM/dd');
    this.setOpen(false, 2);
  }
  // <!------------------------------------------------------------------------------------------------------>

  async agregarPeso() {
    this.isSubmitted = true;
    this.form.setValue({peso : this.form.getRawValue().peso, fecha : this.fechaValor});
   
    if(this.form.valid) {
      this.pesaje.peso = this.form.getRawValue().peso
      this.pesaje.fecha = this.form.getRawValue().fecha

      this.form.reset();
      this.setOpen(false, 1);

      this.graficaSub.unsubscribe();
      this.myChart.destroy();
      await this.produccionService.addPeso(this.fincaId, this.animalId, this.pesaje);
      this.isSubmitted = false;

      this.mostrarGrafico();
    } else {
      this.form.markAllAsTouched();
    }
  }

  crearGrafico() {
    const canvas = document.getElementById('myChartCarne');
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

  get errorControl() {
    return this.form.controls;
  }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    //console.log(ev.detail.role);

    if (ev.detail.role === 'backdrop') {
      //console.log(this.evento);
      this.setOpen(false, 1);
      this.setOpen(false, 2);
      this.form.reset();
    }
  }

}
