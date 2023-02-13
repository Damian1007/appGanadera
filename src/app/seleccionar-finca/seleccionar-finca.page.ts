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
  usuarioId = localStorage.getItem("usuarioId");
  
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
      coordenadas: ''
    }];
  }

  ngOnInit(){
    this.fincaService.getFincas().subscribe(finca => {
      this.fincas = finca;
    });

    //this.getFinca();
  }

  ionViewDidLeave(){

  }

  getFinca() {
    this.fincaService.getFincas().subscribe(finca => {
      this.fincas.pop()

      for (let i = 0; i < finca.length; i++) {
        this.miembrosServices.getMiembro(finca[i].id, this.usuarioId).subscribe(miembro => {
          if(miembro) {
            console.log(miembro['id'], finca[i].id);
            this.fincas.push(finca[i]);
          }
          else {
            console.log(miembro);
          } 
        });  
      }
    });
    
  }

  getId(id : any) {
    localStorage.setItem('id', id);
    this.router.navigate(['/tabs/finca'], { replaceUrl: true });
  }
  
  // ionViewDidEnter() {
  //   this.menuCtrl.enable(true);
  // }

  // ngOnInit(){
  //   this.fincaLoader = this.fincaService.getFincas().subscribe(finca => {
  //     this.fincas = finca;

  //     this.fincasVista.pop();
  //     this.fincas.forEach(finca => {
  //       //console.log(finca);
  //       this.miembroLoader = this.miembrosServices.getMiembro(finca.id, this.usuarioId).subscribe(miembro => {
  //         //console.log(miembro);
  //         if(miembro) {
  //           // console.log(miembro);
  //           if(miembro['id'] == this.usuarioId) {
  //             this.fincasVista.push(finca);
  //           }
  //         }
  //       })
  //     });
  //   });
  // }

  // ionViewDidLeave(){
  //   this.fincaLoader.unsubscribe();
  //   this.miembroLoader.unsubscribe();
  // }
}
