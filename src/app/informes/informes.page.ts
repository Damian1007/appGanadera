import { Component, OnInit } from '@angular/core';
import { InformesService } from '../services/informes.service';
import { AnimalService } from '../services/animal.service';
import { ProduccionService } from '../services/produccion.service';
import { Subscription } from 'rxjs';
import { Animal } from '../interfaces/animal';
import { Pesaje } from '../interfaces/pesaje';
import { Ordeño } from '../interfaces/ordeño';

@Component({
  selector: 'app-informes',
  templateUrl: './informes.page.html',
  styleUrls: ['./informes.page.scss'],
})
export class InformesPage implements OnInit {

  animales: Animal[];
  pesajes : Pesaje[];
  pesajesAux : any[];
  ordeños : any[];
  fincaId : any;
  animalSub : Subscription;
  pesajesSub : Subscription;
  ordeñoSub : Subscription;

  constructor(
    private informe : InformesService,
    private animalService : AnimalService,
    private produccionService : ProduccionService,
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

    this.pesajes = [{
      peso: '',
      fecha: ''
    }];
  }

  ngOnInit() {
    this.fincaId = localStorage.getItem('id');
    this.pesajesAux = [];

    this.informeAnimales();
  }

  ionViewDidLeave() {
    if(this.animalSub) {
      this.animalSub.unsubscribe();
    }
    
    if(this.pesajesSub) {
      this.pesajesSub.unsubscribe();
    }

    if(this.ordeñoSub) {
      this.ordeñoSub.unsubscribe();
    }
  }

  informeAnimales() {
    this.animalSub = this.animalService.getAnimales(this.fincaId).subscribe(animales => {
      this.animales = animales;

      this.informeCarne();
      this.pesajes = this.pesajesAux;
      console.log(this.pesajes);
    });
  }

  informeCarne() {
    this.animales.forEach(animal => {
      this.pesajesSub = this.produccionService.getPesajes(this.fincaId, animal.id).subscribe(pesajes => {

        pesajes.forEach(pesaje => {
          this.pesajesAux.push(
            {nombre : animal.nombre, peso : pesaje.peso, fecha : pesaje.fecha}
          );            
        });      
       
        this.pesajesAux.sort(function (a, b) {
          if (a.fecha > b.fecha) {
            return 1;
          }
    
          if (a.fecha < b.fecha) {
            return -1;
          }
          
          // a must be equal to b
          return 0;      
        });
      });
    });
    
    
  }

  informeLeche() {
    this.animales.forEach(animal => {
      this.ordeñoSub = this.produccionService.getOrdeños(this.fincaId, animal.id).subscribe(ordeños => {
        this.ordeños = ordeños;
      });
    });
  }

  exportToExcel() {
    this.informe.exportToExcel(this.pesajes, 'Pesajes');
  }
}
