import { Component, OnInit } from '@angular/core';
import { Finca } from '../interfaces/finca';
import { FincaService } from '../services/finca.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-finca',
  templateUrl: './finca.page.html',
  styleUrls: ['./finca.page.scss'],
})
export class FincaPage implements OnInit {

  finca : Finca;
  fincaId = localStorage.getItem('id');
  usuarioId = localStorage.getItem('usuarioId');

  constructor(
    private fincaService : FincaService,
    private router : Router,
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
        coordenadas: '',
        propietario: ''
      };
    }

  ngOnInit() {  
    this.fincaService.getFinca(this.fincaId).subscribe(finca => {
      this.finca = finca;

      if (this.finca.foto == '') {
        this.finca.foto = "assets/icon/imagen_camara.png"
      }
    })
  }

  eliminarFinca() {
    console.log("Desconectado");
    // this.miembroService.deleteMiembro(this.fincaId, this.usuarioId);
    // this.fincaService.deleteFinca(this.fincaId);
    //this.router.navigate(['/seleccionar-finca']);
  }
}
