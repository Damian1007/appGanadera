import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AnimalService } from '../services/animal.service';
import { Animal } from '../interfaces/animal';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-animal',
  templateUrl: './animal.page.html',
  styleUrls: ['./animal.page.scss'],
})
export class AnimalPage implements OnInit {

  animal : Animal;
  fincaId : any;
  animalId : any;
  animalNombre : any;
  animalSub : Subscription;
  
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

  ionViewWillEnter(){
    this.fincaId = localStorage.getItem('id');
    this.animalId = localStorage.getItem('animalId');

    this.animalSub = this.animalService.getAnimal(this.fincaId, this.animalId).subscribe(animal => {
      this.animal = animal;
      this.animalNombre = localStorage.setItem('animalNombre', animal.nombre);
    });
  }

  ionViewDidLeave() {
    this.animalSub.unsubscribe();
  }

  actualizarAnimal() {
    this.router.navigate(['/actualizar-animal'], { replaceUrl: true });
  }

  eliminarAnimal() {
    this.animalService.deleteAnimal(this.fincaId, this.animalId)
    this.router.navigate(['/tabs/animales'], { replaceUrl: true });
  }

  salud() {
    this.router.navigate(['/tabs/salud']);
  }

  produccionCarne() {
    this.router.navigate(['/tabs/produccion-carne']);
  }

  produccionLeche() {
    this.router.navigate(['/tabs/produccion-leche']);
  }

  reproduccion() {
    this.router.navigate(['/tabs/reproduccion']);
  }
}
