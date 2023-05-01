import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InformesService } from '../services/informes.service';
import { AnimalService } from '../services/animal.service';
import { ProduccionService } from '../services/produccion.service';
import { SaludService } from '../services/salud.service';
import { ReproduccionService } from '../services/reproduccion.service';
import { FincaService } from '../services/finca.service';
import { Subscription } from 'rxjs';
import { Animal } from '../interfaces/animal';
import { Pesaje } from '../interfaces/pesaje';
import { Ordeño } from '../interfaces/ordeño';
import { Salud } from '../interfaces/salud';
import { Reproduccion } from '../interfaces/reproduccion';

@Component({
  selector: 'app-informes',
  templateUrl: './informes.page.html',
  styleUrls: ['./informes.page.scss'],
})
export class InformesPage implements OnInit {

  form : FormGroup;
  animales: Animal[];
  pesajes : Pesaje[];
  pesajesAux : any[];
  ordeños : Ordeño[];
  ordeñosAux : any[];
  historias : Salud[];
  historiasAux : any[];
  eventos : Reproduccion[];
  eventosAux : any[];

  isSubmitted = false;
  prueba = false;
  tipoInforme : any;
  fincaId : any;
  fincaNombre : string;
  animalSub : Subscription;
  pesajesSub : Subscription;
  ordeñoSub : Subscription;
  saludSub : Subscription;
  reproduccionesSub : Subscription;
  fincaSub : Subscription;

  constructor(
    private formBuilder : FormBuilder,
    private informe : InformesService,
    private animalService : AnimalService,
    private produccionService : ProduccionService,
    private saludService : SaludService,
    private reproduccionService : ReproduccionService,
    private fincaService : FincaService
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

    this.form = this.formBuilder.group({
      tipo: ['', [Validators.required]],
    });

    this.fincaSub = this.fincaService.getFinca(this.fincaId).subscribe(finca => {
      this.fincaNombre = finca.nombre;
    });

    this.informeAnimales();
  }

  ionViewDidLeave() {
    this.animalSub.unsubscribe();
    this.fincaSub.unsubscribe();
    this.pesajesSub.unsubscribe();
    this.ordeñoSub.unsubscribe();
    this.saludSub.unsubscribe();
    this.reproduccionesSub.unsubscribe();
  }

  exportToExcel() {
    this.isSubmitted = true;

    if(this.form.valid) {
      switch (this.form.getRawValue().tipo) {
        case 'IC':
          this.informe.crearToExcelAll(this.animales, this.pesajes, this.ordeños, this.historias, this.eventos, 'Informe ' + this.fincaNombre);
          break;
        
        case 'A':
          this.informe.crearToExcel(this.animales, 'Animales ', this.fincaNombre);
          this.prueba = true;
          break;

        case 'PC':
          this.informe.crearToExcel(this.pesajes, 'Pesajes ', this.fincaNombre);
          
          break;

        case 'PL':
          this.informe.crearToExcel(this.ordeños, 'Ordeños ', this.fincaNombre);
          
          break;

        case 'HM':
          this.informe.crearToExcel(this.historias, 'Salud ', this.fincaNombre);
          
          break;

        case 'R':
          this.informe.crearToExcel(this.eventos, 'Reproducción ', this.fincaNombre);
          
          break;

        default:
          break;
      }
      
    }else {
      this.form.markAllAsTouched();
    }
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

  get errorControl() {
    return this.form.controls;
  }
}
