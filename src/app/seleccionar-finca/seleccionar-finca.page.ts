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
  noFincas : boolean;

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
  }

  ionViewWillEnter(){
    this.getFincas()
  }

  ionViewDidLeave(){
    this.miembroSub.unsubscribe();
    this.fincaSub.unsubscribe();
  }

  getFincas(){
    this.fincaSub = this.fincaService.getFincas().subscribe(finca => {
      this.fincas = finca;
      this.fincasAux = finca;

      if (finca.length == 0) {
        this.noFincas = true;
      }

      this.fincas.map((finca : any) => {
        //console.log(finca);
        this.miembroSub = this.miembrosServices.getMiembro(finca.id, this.usuarioId).subscribe( miembro => {
          //console.log(miembro);
          if(!miembro) {
            //console.log(miembro);
            this.fincasAux.splice(this.fincasAux.indexOf(finca), 1);
          }
        })
      });
    });
    
  }

  getId(id : any) {
    localStorage.setItem('id', id);
    this.router.navigate(['/tabs/finca'], { replaceUrl: true });
  }
}
