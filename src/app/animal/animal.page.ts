import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AnimalService } from '../services/animal.service';
import { Animal } from '../interfaces/animal';
import { Subscription } from 'rxjs';
import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { __await } from 'tslib';

@Component({
  selector: 'app-animal',
  templateUrl: './animal.page.html',
  styleUrls: ['./animal.page.scss'],
})
export class AnimalPage implements OnInit {
  @ViewChild(IonModal) modal: IonModal;

  animal : Animal;
  fincaId : any;
  animalId : any;
  animalNombre : any;
  animalSub : Subscription;
  isModalOpen = false;
  
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

  setOpen(isOpen : boolean) {
    this.isModalOpen = isOpen;
  }

  actualizarAnimal() {
    this.router.navigate(['/actualizar-animal'], { replaceUrl: true });
  }

  eliminarAnimal() {
    // this.animalService.deleteAnimal(this.fincaId, this.animalId)
    // this.router.navigate(['/tabs/animales'], { replaceUrl: true });
  }

  salud() {
    this.setOpen(false)
    this.router.navigate(['/tabs/salud']);
  }

  produccionCarne() {
    this.setOpen(false);
    this.router.navigate(['/tabs/produccion-carne']);
  }

  produccionLeche() {
    this.setOpen(false);
    this.router.navigate(['/tabs/produccion-leche']);
  }

  reproduccion() {
    this.setOpen(false);
    this.router.navigate(['/tabs/reproduccion']);
  }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;

    if (ev.detail.role === 'backdrop') {
      //console.log(this.evento);
      this.setOpen(false);
    }
  }
}
