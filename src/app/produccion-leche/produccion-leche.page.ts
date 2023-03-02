import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IonModal } from '@ionic/angular';
import { Chart } from 'chart.js';
import { format, parseISO } from 'date-fns';
import { Subscription } from 'rxjs';
import { Ordeño } from '../interfaces/ordeño';
import { ProduccionService } from '../services/produccion.service';

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

  showPicker = false;
  dateValor = format(new Date(), 'yyyy-MM-dd');
  fechaValor = '';
  ordeñosArray : any[];
  label : any[];
  data : any[];

  form = this.formBuilder.group({
    leche: ['', [Validators.required]],
    fecha: [''],
  });

  constructor(private produccionService : ProduccionService,
    private router : Router,
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

  async agregarLeche() {
    this.form.setValue({leche : this.form.getRawValue().leche, fecha : this.fechaValor});
    //console.log(this.form.getRawValue());

    this.ordeño.leche = this.form.getRawValue().leche
    this.ordeño.fecha = this.form.getRawValue().fecha

    this.modal.dismiss(null, 'leche');
    this.graficaSub.unsubscribe();

    this.myChart.destroy();
    await this.produccionService.addOrdeño(this.fincaId, this.animalId, this.ordeño);

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
  
}
