import { Component, OnInit } from '@angular/core';
import { Finca } from '../interfaces/finca';
import { FincaService } from '../services/finca.service';

@Component({
  selector: 'app-finca',
  templateUrl: './finca.page.html',
  styleUrls: ['./finca.page.scss'],
})
export class FincaPage implements OnInit {

  finca : Finca;

  constructor(
    private fincaService : FincaService
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
    this.fincaService.getFinca(this.finca).subscribe(finca => {
      this.finca = finca;
      console.log(finca);
    })
    
  }

}
