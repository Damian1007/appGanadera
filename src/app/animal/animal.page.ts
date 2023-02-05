import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AnimalService } from '../services/animal.service';
import { Animal } from '../interfaces/animal';
import { url } from 'inspector';

@Component({
  selector: 'app-animal',
  templateUrl: './animal.page.html',
  styleUrls: ['./animal.page.scss'],
})
export class AnimalPage implements OnInit {

  animal : Animal;
  fincaId = localStorage.getItem('id');
  animalId : any;

  constructor(
    private animalService : AnimalService,
    private router : Router
  ) { 
      this.animal = {
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
      };
    }

  ngOnInit() {    
  }

  ionViewWillEnter() {
    this.animalId = localStorage.getItem('animalId');

    this.animalService.getAnimal(this.fincaId, this.animalId).subscribe(animal => {
      this.animal = animal;
    })
  }

  eliminarAnimal() {
    this.animalService.deleteAnimal(this.fincaId, this.animalId)
    this.router.navigate(['/tabs/animales']);
  }
}
