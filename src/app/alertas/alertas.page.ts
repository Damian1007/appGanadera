import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Alertas } from '../interfaces/alertas';
import { AlertasService } from '../services/alertas.service';

@Component({
  selector: 'app-alertas',
  templateUrl: './alertas.page.html',
  styleUrls: ['./alertas.page.scss'],
})
export class AlertasPage implements OnInit {

  alertas : Alertas[];
  fincaId = localStorage.getItem('id');
  alertasSub : Subscription;
  
  constructor(
    private alertasService : AlertasService
  ) { 
    this.alertas = [{
      id: '',
      usuario: '',
      cambio: '',
      foto: '',
      fecha: ''
    }];
   }

  ngOnInit() {}

  ionViewWillEnter() {
    this.alertasSub = this.alertasService.getAlertas(this.fincaId).subscribe(alertas => {
      this.alertas = alertas;

      this.alertas.sort(function (a, b) {
        if (a.fecha > b.fecha) {
          return -1;
        }

        if (a.fecha < b.fecha) {
          return 1;
        }
        
        // a must be equal to b
        return 0;
      });
    });
  }

  ionViewDidLeave() {
    this.alertasSub.unsubscribe();
  }
}
