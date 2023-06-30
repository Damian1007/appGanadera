import { Component, OnInit } from '@angular/core';
import { Finca } from '../interfaces/finca';
import { FincaService } from '../services/finca.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-finca',
  templateUrl: './finca.page.html',
  styleUrls: ['./finca.page.scss'],
})
export class FincaPage implements OnInit {

  finca : Finca;
  fincaId = localStorage.getItem('id');
  usuarioId = localStorage.getItem('usuarioId');
  fincaSub : Subscription;

  constructor(
    private fincaService : FincaService,
    private router : Router,
    public toastController : ToastController
  ) { 
      this.finca = {
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
      };
    }

  ngOnInit() {  
    this.fincaSub = this.fincaService.getFinca(this.fincaId).subscribe(finca => {
      this.finca = finca;
    });
  }

  ionViewDidLeave() {
    console.log("finca");
    this.fincaSub.unsubscribe();
  }

  eliminarFinca() {
    this.presentToast();
    // this.miembroService.deleteMiembro(this.fincaId, this.usuarioId);
    // this.fincaService.deleteFinca(this.fincaId);
    //this.router.navigate(['/seleccionar-finca']);
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'La opción de eliminar estas desactivada',
      duration: 5000,
      position: "bottom",
      cssClass: "toast-custom-class"
    });
    toast.present()
  }
}
