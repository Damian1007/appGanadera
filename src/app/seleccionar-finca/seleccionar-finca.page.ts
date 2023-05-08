import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Finca } from '../interfaces/finca';
import { FincaService } from '../services/finca.service';
import { Router } from '@angular/router';
import { MiembrosService } from '../services/miembros.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-seleccionar-finca',
  templateUrl: './seleccionar-finca.page.html',
  styleUrls: ['./seleccionar-finca.page.scss'],
})
export class SeleccionarFincaPage implements OnInit {

  fincas : Finca[];
  fincasAux : Finca[];
  usuarioId = localStorage.getItem("usuarioId");
  fincaSub : Subscription;
  miembroSub : Subscription;

  noFincas : boolean = true;

  constructor(
    private fincaService : FincaService,
    public menuCtrl: MenuController,
    private router : Router,
    private miembrosServices : MiembrosService
  ) 
  { 
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
      coordenadas: '',
      propietario: ''
    }];
  }

  ngOnInit(){
    this.menuCtrl.enable(true);
  }

  ionViewWillEnter(){
    this.fincaSub = this.fincaService.getFincas().subscribe(fincasGet => {
      this.fincas.pop();
      this.fincasAux = fincasGet;

      this.getMiembrosFinca(fincasGet);
    });
  }

  ionViewDidLeave(){
    this.miembroSub.unsubscribe();
    this.fincaSub.unsubscribe();
  }

  getMiembrosFinca(fincasGet : any) {
    fincasGet.map((finca : any) => {
      this.miembroSub = this.miembrosServices.getMiembro(finca.id, this.usuarioId).subscribe( miembro => {

        if(miembro) {
          const Aux = this.fincasAux.slice(this.fincasAux.indexOf(finca), this.fincasAux.indexOf(finca) + 1);
          this.fincas.push(Aux.pop());
          this.noFincas = false;
        }
        //console.log(this.fincasAux)
      });
    });
  }

  getId(id : any) {
    localStorage.setItem('id', id);
    this.router.navigate(['/tabs/finca'], { replaceUrl: true });
  }
}
