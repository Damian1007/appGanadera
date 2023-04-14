import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { IonModal } from '@ionic/angular';
import { Chart } from 'chart.js';
import { format, parseISO } from 'date-fns';
import { Subscription } from 'rxjs';
import { Ordeño } from '../interfaces/ordeño';
import { ProduccionService } from '../services/produccion.service';
import { OverlayEventDetail } from '@ionic/core/components';

@Component({
  selector: 'app-produccion-leche',
  templateUrl: './produccion-leche.page.html',
  styleUrls: ['./produccion-leche.page.scss'],
})
export class ProduccionLechePage implements OnInit {
  @ViewChild(IonModal) modal: IonModal;

  ordeño : Ordeño;
  fincaId : any;
  animalId : any;
  graficaSub : Subscription;
  myChart : Chart

  isModalOpen = false;
  isModalOpen2 = false;
  isSubmitted = false;
  fechaValor = '';
  ordeñosArray : any[];
  label : any[];
  data : any[];

  form = this.formBuilder.group({
    leche: ['', [Validators.required, Validators.pattern('[0-9]+')]],
    fecha: [''],
  });

  constructor(private produccionService : ProduccionService,
    private formBuilder : FormBuilder) { 

      this.ordeño = {
        leche: '',
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
    this.ordeñosArray = [];
    this.label = [];
    this.data = [];

    this.graficaSub = this.produccionService.getOrdeños(this.fincaId, this.animalId).subscribe(ordeños=> {
      ordeños.forEach(ordeño => {
        
        this.ordeñosArray.push(
          {leche : ordeño.leche, fecha : ordeño.fecha}
        );

      });

      this.ordeñosArray.sort(function (a, b) {
        if (a.fecha > b.fecha) {
          return 1;
        }

        if (a.fecha < b.fecha) {
          return -1;
        }
        
        // a must be equal to b
        return 0;
      });

      this.ordeñosArray.forEach(o => {
        this.label.push(o.fecha);
        this.data.push(o.leche);
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

  async agregarLeche() {
    this.isSubmitted = true;
    this.form.setValue({leche : this.form.getRawValue().leche, fecha : this.fechaValor});
    
    if(this.form.valid) {
      this.ordeño.leche = this.form.getRawValue().leche
      this.ordeño.fecha = this.form.getRawValue().fecha

      this.form.reset();
      this.setOpen(false, 1);

      this.graficaSub.unsubscribe();
      this.myChart.destroy();
      await this.produccionService.addOrdeño(this.fincaId, this.animalId, this.ordeño);
      this.isSubmitted = false;

      this.mostrarGrafico();
    } else {
      this.form.markAllAsTouched();
    }
  }

  crearGrafico() {
    const canvas = document.getElementById('myChartLeche');
    const ctx = (canvas as HTMLCanvasElement).getContext('2d');
    this.myChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.label,
        datasets: [{
          label: 'Volumen de Leche en Litros',
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
