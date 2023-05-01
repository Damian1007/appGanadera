import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AnimalService } from '../services/animal.service';
import { Animal } from '../interfaces/animal';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-animales',
  templateUrl: './animales.page.html',
  styleUrls: ['./animales.page.scss'],
})
export class AnimalesPage implements OnInit {

  animales : Animal[];
  fincaId = localStorage.getItem('id');
  animalSub : Subscription;

  constructor(
    private animalService : AnimalService,
    private router : Router
  ) { 
      this.animales = [{
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

  ngOnInit() {}

  ionViewWillEnter(){
    this.animalSub = this.animalService.getAnimales(this.fincaId).subscribe(animales => {
      this.animales = animales;
    });
  }

  ionViewDidLeave() {
    this.animalSub.unsubscribe();
  }

  getId(id : any) {
    localStorage.setItem('animalId', id);
    this.router.navigate(['/tabs/animal'], { replaceUrl: true });
  }

}
