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
      nombre: '',
      orientacion: '',
      areaFinca: '',
      areaGanaderia: '',
      foto: '',
      departamento: '',
      ciudad: '',
      corregimiento: '',
      vereda_sector: '',
      coordenadas: '',
      propietario: ''
    }];
  }

  ngOnInit(){
    this.menuCtrl.enable(true);
  }

  ionViewWillEnter(){
    this.fincaSub = this.fincaService.getFincas().subscribe(fincasGet => {

      this.fincas = fincasGet.filter( finca => finca.propietario == this.usuarioId);
      this.noFincas = false;
      

      
    });
  }

      // fincasGet.map((finca : any) => {
      //   this.miembroSub = this.miembrosServices.getMiembro(finca.id, this.usuarioId).subscribe( miembro => {
      //     //console.log(miembro, 'miembro');
      //     if(miembro) {
  
      //       let Aux = fincasGet.slice(fincasGet.indexOf(finca), fincasGet.indexOf(finca) + 1);
      //       this.fincas.push(Aux.pop());
  
      //       //console.log(this.fincas);
      //       this.noFincas = false;
      //     }
          
      //   });
      // });

  ionViewDidLeave(){
    console.log("selec fuera");
    this.fincaSub.unsubscribe();
    //this.miembroSub.unsubscribe();
    
  }

  getId(id : any) {
    localStorage.setItem('id', id);
    this.router.navigate(['/finca'], { replaceUrl: true });
  }
}
