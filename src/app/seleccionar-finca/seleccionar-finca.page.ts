import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-seleccionar-finca',
  templateUrl: './seleccionar-finca.page.html',
  styleUrls: ['./seleccionar-finca.page.scss'],
})
export class SeleccionarFincaPage implements OnInit {

  constructor(
    public menuCtrl: MenuController
  ) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.menuCtrl.enable(true);
  }

}
