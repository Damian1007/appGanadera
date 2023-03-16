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
    this.getFincas();
  }

  ionViewDidLeave(){
    this.miembroSub.unsubscribe();
    this.fincaSub.unsubscribe();
  }

  getFincas() {
    this.fincaSub = this.fincaService.getFincas().subscribe(finca => {
      finca.forEach(f => {
        this.miembroSub = this.miembrosServices.getMiembro(f.id, this.usuarioId).subscribe(miembro => {
          
          if(miembro) {
            console.log(miembro.id, f.id);
            this.fincas.push(f);
          }
          else {
            console.log(miembro);
          } 
        });
      });
    });
  }

  getId(id : any) {
    localStorage.setItem('id', id);
    this.router.navigate(['/tabs/finca'], { replaceUrl: true });
  }
  
}
