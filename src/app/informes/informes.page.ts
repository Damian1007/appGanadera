import { Component, OnInit } from '@angular/core';
import { InformesService } from '../services/informes.service';
import { AnimalService } from '../services/animal.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-informes',
  templateUrl: './informes.page.html',
  styleUrls: ['./informes.page.scss'],
})
export class InformesPage implements OnInit {

  animales: any[];
  fincaId : any;
  animalId : any;
  animalSub : Subscription;

  constructor(
    private informe : InformesService,
    private animalService : AnimalService
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

  ngOnInit() {
    this.fincaId = localStorage.getItem('id');
    this.animalId = localStorage.getItem('animalId');

    this.loadData();
  }

  ionViewDidLeave() {
    this.animalSub.unsubscribe();
  }

  loadData() {
    this.animalSub = this.animalService.getAnimales(this.fincaId).subscribe(animales => {
      this.animales = animales;
    });
  }

  exportToExcel() {
    this.informe.exportToExcel(this.animales, 'Animales');
  }
}
