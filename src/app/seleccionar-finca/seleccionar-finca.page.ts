import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Finca } from '../interfaces/finca';
import { FincaService } from '../services/finca.service';

@Component({
  selector: 'app-seleccionar-finca',
  templateUrl: './seleccionar-finca.page.html',
  styleUrls: ['./seleccionar-finca.page.scss'],
})
export class SeleccionarFincaPage implements OnInit {

  fincas : Finca[];

  constructor(
    public menuCtrl: MenuController,
    private fincaService : FincaService
  ) { 
      this.fincas = [{
        nombre: '',
        orientacion: '',
        areaFinca: '',
        areaGanaderia: '',
        foto: '',
        departamento: '',
        ciudad: '',
        corregimiento: '',
        coordenadas: ''
      }];
    }

  ngOnInit() {
    this.fincaService.getFincas().subscribe(fincas => {
      this.fincas = fincas;
    })
  }

  // ionViewDidEnter() {
  //   this.menuCtrl.enable(true);
  // }

}
