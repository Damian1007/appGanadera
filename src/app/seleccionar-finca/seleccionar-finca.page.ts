import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Finca } from '../interfaces/finca';
import { FincaService } from '../services/finca.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-seleccionar-finca',
  templateUrl: './seleccionar-finca.page.html',
  styleUrls: ['./seleccionar-finca.page.scss'],
})
export class SeleccionarFincaPage implements OnInit {

  fincas : Finca[];

  constructor(
    public menuCtrl: MenuController,
    private fincaService : FincaService,
    private router : Router,
  ) { 
      this.fincas = [{
        id: '',
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

  getId(id : any) {
    localStorage.setItem('id', id);
    this.router.navigate(['/tabs/finca']);
  }

  // ionViewDidEnter() {
  //   this.menuCtrl.enable(true);
  // }

}
