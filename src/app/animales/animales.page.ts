import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AnimalService } from '../services/animal.service';
import { Animal } from '../interfaces/animal';

@Component({
  selector: 'app-animales',
  templateUrl: './animales.page.html',
  styleUrls: ['./animales.page.scss'],
})
export class AnimalesPage implements OnInit {

  animales : Animal[];
  fincaId = localStorage.getItem('id');

  constructor(
    private animalService : AnimalService,
    private router : Router
  ) { 
      this.animales = [{
        id: '',
        nombre: '',
        genero: '',
        foto: '',
        lote: '',
        raza: '',
        grupoEtario: '',
        fechaNacimiento: '',
        padre: '',
        madre: '',
        pesoActual: ''
      }];
    }

  ngOnInit() {
    this.animalService.getAnimales(this.fincaId).subscribe(animales => {
      this.animales = animales;
    })
  }

}
