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

  constructor(
    private fincaService : FincaService,
    private router : Router
  ) { 
      this.finca = {
        id: localStorage.getItem('id'),
        nombre: '',
        orientacion: '',
        areaFinca: '',
        areaGanaderia: '',
        foto: '',
        departamento: '',
        ciudad: '',
        corregimiento: '',
        coordenadas: ''
      };
    }

  ngOnInit() {  
    this.fincaService.getFinca(this.finca.id).subscribe(finca => {
      this.finca = finca;
    })
  }

  eliminarFinca() {
    this.fincaService.deleteFinca(this.fincaId);
    this.router.navigate(['/seleccionar-finca']);
  }
}
