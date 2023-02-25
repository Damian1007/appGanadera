import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-produccion-carne',
  templateUrl: './produccion-carne.page.html',
  styleUrls: ['./produccion-carne.page.scss'],
})
export class ProduccionCarnePage implements OnInit {

  constructor() { }

  ngOnInit() {
    this.crearGrafico();
  }

  crearGrafico() {
    const canvas = document.getElementById('myChart');
    const ctx = (canvas as HTMLCanvasElement).getContext('2d');
    const myChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre','Octubre', 'Noviembre', 'Diciembre'],
        datasets: [{
          label: '# of votes',
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
}
