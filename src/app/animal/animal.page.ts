import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AnimalService } from '../services/animal.service';
import { Animal } from '../interfaces/animal';
import { Subscription } from 'rxjs';
import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { ToastController } from '@ionic/angular';

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

  modalOrdeno = true;
  modalReproduccion = true;
  
  constructor(
    private animalService : AnimalService,
    private router : Router, 
    public toastController : ToastController
  ) { 
      this.animal = {
        id: '',
        nombre: '',
        genero: '',
        foto: '',
        ubicacion: '',
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
    this.modalOrdeno = true;
    this.modalReproduccion = true;
  }

  setOpen(isOpen : boolean) {
    this.isModalOpen = isOpen;
  }

  actualizarAnimal() {
    this.router.navigate(['/actualizar-animal'], { replaceUrl: true });
  }

  eliminarAnimal() {
    this.presentToast();
    // this.animalService.deleteAnimal(this.fincaId, this.animalId)
    // this.router.navigate(['/tabs/animales'], { replaceUrl: true });
  }

  salud() {
    this.modal.isOpen = false;
    this.router.navigate(['/salud'], { replaceUrl: true });
  }

  produccionCarne() {
    this.modal.isOpen = false;
    this.router.navigate(['/produccion-carne'], { replaceUrl: true });
  }

  produccionLeche() {
    this.modal.isOpen = false;
    localStorage.setItem('animalGenero', this.animal.genero);
    this.router.navigate(['/produccion-leche'], { replaceUrl: true });
  }

  reproduccion() {
    this.modal.isOpen = false;
    this.router.navigate(['/reproduccion'], { replaceUrl: true });
  }

  opciones() {
    //console.log("Opciones");
    if(this.animal.genero == 'Macho'){
      this.modalReproduccion = false;
      this.modalOrdeno = false;
      //console.log("Macho");
    }

    if(this.animal.grupoEtario == 'Vaca seca' && this.animal.genero == 'Hembra'){
      this.modalOrdeno = false;
      //console.log("horra");
    }
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

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;

    if (ev.detail.role === 'backdrop') {
      //console.log(this.evento);
      this.setOpen(false);
    }
  }
}
