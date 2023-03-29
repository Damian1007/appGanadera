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
    });
  }

  ionViewDidLeave() {
    this.alertasSub.unsubscribe();
  }
}
