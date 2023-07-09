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
  fincasSub : Subscription;
  miembroSub : Subscription;

  noFincasBool : boolean = true;

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
      vereda_sector: '',
      coordenadas: '',
      propietario: ''
    }];
  }

  ngOnInit(){
    this.menuCtrl.enable(true);
    //this.fincas.pop();
    //this.fincas = [];
  }

  ionViewWillEnter(){
    this.fincasSub = this.fincaService.getFincas().subscribe(fincasGet => {
      this.fincas = fincasGet;
      
      fincasGet.map((finca : any) => {
        this.miembroSub = this.miembrosServices.getMiembro(finca.id, this.usuarioId).subscribe(miembro => {
          //console.log(miembro);
          if(!miembro) {

            this.fincas.splice(fincasGet.indexOf(finca), 1);

            // let Aux = fincasGet.slice(fincasGet.indexOf(finca), fincasGet.indexOf(finca) + 1);
            // this.fincas.push(Aux.pop());

            setTimeout(()=>{
              this.noFincasBool = false;
            },500)
          }
        });
      });
    });
  }

  ionViewDidLeave(){
    //console.log("selec fuera");
    this.miembroSub.unsubscribe();
    this.fincasSub.unsubscribe();
  }

  getId(id : any) {
    localStorage.setItem('id', id);
    //console.log(id);
    this.router.navigate(['/finca'], { replaceUrl: true });
  }

  crear() {
    this.router.navigate(['/crear-finca'], { replaceUrl: true });
  }
}
