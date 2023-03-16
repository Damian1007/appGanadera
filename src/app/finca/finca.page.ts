import { Component, OnInit } from '@angular/core';
import { Finca } from '../interfaces/finca';
import { FincaService } from '../services/finca.service';
import { Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { MiembrosService } from '../services/miembros.service';
import { AnimalService } from '../services/animal.service';

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
    private miembroService : MiembrosService,
    private animalService : AnimalService,
    private router : Router,
    private auth : Auth
  ) { 
      this.finca = {
        id: this.fincaId,
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
    })
  }

  eliminarFinca() {
    console.log("Desconectado");
    // this.miembroService.deleteMiembro(this.fincaId, this.usuarioId);
    // this.fincaService.deleteFinca(this.fincaId);
    this.router.navigate(['/seleccionar-finca']);
  }
}
