import { Component, OnInit } from '@angular/core';
import { InformesService } from '../services/informes.service';
import { AnimalService } from '../services/animal.service';
import { ProduccionService } from '../services/produccion.service';
import { SaludService } from '../services/salud.service';
import { Subscription } from 'rxjs';
import { Animal } from '../interfaces/animal';
import { Pesaje } from '../interfaces/pesaje';
import { Ordeño } from '../interfaces/ordeño';
import { Salud } from '../interfaces/salud';
import { ReproduccionService } from '../services/reproduccion.service';
import { Reproduccion } from '../interfaces/reproduccion';

@Component({
  selector: 'app-informes',
  templateUrl: './informes.page.html',
  styleUrls: ['./informes.page.scss'],
})
export class InformesPage implements OnInit {

  animales: Animal[];
  pesajes : Pesaje[];
  pesajesAux : any[];
  ordeños : Ordeño[];
  ordeñosAux : any[];
  historias : Salud[];
  historiasAux : any[];
  eventos : Reproduccion[];
  eventosAux : any[];
  fincaId : any;
  animalSub : Subscription;
  pesajesSub : Subscription;
  ordeñoSub : Subscription;
  saludSub : Subscription;
  reproduccionesSub : Subscription;

  constructor(
    private informe : InformesService,
    private animalService : AnimalService,
    private produccionService : ProduccionService,
    private saludService : SaludService,
    private reproduccionService : ReproduccionService
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

    this.ordeños = [{
      leche: '',
      fecha: ''
    }];

    this.historias = [{
      ref: '',
      nombre: '',
      sintomas: '',
      nomMedicamento: '',
      canMedicamento: '',
      fecha: ''
    }];

    this.eventos = [{
      tipo: '',
      nombreToro: '',
      fechaMonta: '',
      nombreCria: '',
      fechaPartoProbable: '',
      fechaParto: ''
    }];
  }

  ngOnInit() {
    this.fincaId = localStorage.getItem('id');
    this.pesajesAux = [];
    this.ordeñosAux = [];
    this.historiasAux = [];
    this.eventosAux = [];

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

    if(this.saludSub) {
      this.saludSub.unsubscribe();
    }

    if(this.reproduccionesSub) {
      this.reproduccionesSub.unsubscribe();
    }
  }

  exportToExcel() {
    this.informe.exportToExcel(this.eventos, 'Reproduccion');
  }

  informeAnimales() {
    this.animalSub = this.animalService.getAnimales(this.fincaId).subscribe(animales => {
      this.animales = animales;

      this.animales.forEach(animal => {
        this.informeCarne(animal);
        this.informeLeche(animal);
        this.informeHistorias(animal);
        this.informeReproduccion(animal);
      });
      
      this.pesajes = this.pesajesAux;
      this.ordeños = this.ordeñosAux;
      this.historias = this.historiasAux;
      this.eventos = this.eventosAux;
      //console.log(this.ordeños); 
    });
  }

  informeCarne(animal : Animal) {
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
  }

  informeLeche(animal : Animal) {    
    this.ordeñoSub = this.produccionService.getOrdeños(this.fincaId, animal.id).subscribe(ordeños => {
      
      ordeños.forEach(ordeño => {
        this.ordeñosAux.push(
          {nombre : animal.nombre, leche : ordeño.leche, fecha : ordeño.fecha}
        );            
      });
      
      this.ordeñosAux.sort(function (a, b) {
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
  }

  informeHistorias(animal : Animal) {
    this.saludSub = this.saludService.getHistorias(this.fincaId, animal.id).subscribe(historias => {
      
      historias.forEach(historia => {
        this.historiasAux.push(
          {
            tipo : historia.ref, 
            nombre : historia.nombre, 
            sintomas : historia.sintomas, 
            nombre_medicamento : historia.nomMedicamento, 
            cantidad_medicamento : historia.canMedicamento, 
            fecha : historia.fecha
          }
        );            
      });

      this.historiasAux.sort(function (a, b) {
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
  }

  informeReproduccion(animal : Animal) {
    this.reproduccionesSub = this.reproduccionService.getReproducciones(this.fincaId, animal.id).subscribe(eventos => {
      
      eventos.forEach(evento => {
        this.eventosAux.push(
          {
            tipo : evento.tipo, 
            nombre_toro : evento.nombreToro, 
            fecha_monta : evento.fechaMonta, 
            nombre_cria : evento.nombreCria, 
            fecha_parto_probable : evento.fechaPartoProbable, 
            fecha_parto : evento.fechaParto
          }
        );            
      });

      this.eventosAux.sort(function (a, b) {
        if (a.fecha_monta > b.fecha_monta) {
          return 1;
        }

        if (a.fecha_monta < b.fecha_monta) {
          return -1;
        }
        
        // a must be equal to b
        return 0;
      });
    });
  }
}
