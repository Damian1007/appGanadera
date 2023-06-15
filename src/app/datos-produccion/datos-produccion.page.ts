import { Component, OnInit } from '@angular/core';
import { AnimalService } from '../services/animal.service';
import { Animal } from '../interfaces/animal';
import { Subscription } from 'rxjs';
import { ProduccionService } from '../services/produccion.service';
import { format } from 'date-fns';

@Component({
  selector: 'app-datos-produccion',
  templateUrl: './datos-produccion.page.html',
  styleUrls: ['./datos-produccion.page.scss'],
})
export class DatosProduccionPage implements OnInit {

  animales : Animal[];
  fincaId : any;
  animalSub : Subscription;
  pesajeSub : Subscription;
  ordeñoSub : Subscription;

  totalAnimales : number;
  totalHembras : number;
  totalTernerasO : number;
  totalTernerasL : number;
  totalNovillas : number;
  totalVacasL : number;
  totalVacasS : number;
  totalMachos : number;
  totalTernerosO : number;
  totalTernerosL : number;
  totalNovillos : number;
  totalToros : number;
  totalDestetos : number;
  totalMuertos : number;

  pesajeTotal : number;
  mesActual : string;
  yearActual : string;
  prodCarneMes : number;
  prodCarneYear : number;
  prodLecheMes : number;
  prodLecheYear : number;

  constructor(
    private animalService : AnimalService,
    private produccionService : ProduccionService
  ) { 
      this.animales = [{
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
      }];
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.fincaId = localStorage.getItem('id');    

    this.animalSub = this.animalService.getAnimales(this.fincaId).subscribe(animales => {
      this.totalAnimales = animales.length;
      this.totalHembras = 0;
      this.totalTernerasO = 0;
      this.totalTernerasL = 0;
      this.totalNovillas = 0;
      this.totalVacasL = 0;
      this.totalVacasS = 0;
      this.totalMachos = 0;
      this.totalTernerosO = 0;
      this.totalTernerosL = 0;
      this.totalNovillos = 0;
      this.totalToros = 0;
      this.totalMuertos = 0;
      
      this.pesajeTotal = 0;
      this.mesActual = format(new Date(), 'M');
      this.yearActual = format(new Date(), 'yyyy');
      this.prodCarneMes = 0;
      this.prodCarneYear = 0;
      this.prodLecheMes = 0;
      this.prodLecheYear = 0;

      // -------------------------------- SECCIÓN DATOS GENERALES -----------------------------------
      animales.forEach(animal => {
        if (animal.genero == 'Hembra') {
          this.totalHembras++

          switch (animal.grupoEtario) {
            case 'Ternera ordeño': {
              this.totalTernerasO++
              break;
            }
              
            case 'Ternera levante': {
              this.totalTernerasL++
              break;
            }

            case 'Novilla de vientre': {
              this.totalNovillas++
              break;
            }

            case 'Vaca lactante': {
              this.totalVacasL++
              break;
            }

            case 'Vaca seca (horra)': {
              this.totalVacasS++
              break;
            }

            default:
              break;
          }

        } else {
          this.totalMachos++

          switch (animal.grupoEtario) {
            case 'Ternero ordeño': {
              this.totalTernerosO++
              break;
            }
              
            case 'Ternero levante': {
              this.totalTernerosL++
              break;
            }

            case 'Novillo': {
              this.totalNovillos++
              break;
            }

            case 'Toro': {
              this.totalToros++
              break;
            }
            
            default:
              break;
          }
        }

        // -------------------------------- SECCIÓN PRODUCCIÓN DE CARNE -----------------------------------
        this.pesajeSub = this.produccionService.getPesajes(this.fincaId, animal.id).subscribe(pesajes => {
          var ultimoPesoF = '00/00/0000';
          let ultimoPeso = 0;

          pesajes.forEach(pesaje => {
            if (this.mesActual == format(new Date(pesaje.fecha), 'M') && this.yearActual == format(new Date(pesaje.fecha), 'yyyy')) {
              this.prodCarneMes += parseInt(pesaje.peso);
            }
            
            if (this.yearActual == format(new Date(pesaje.fecha), 'yyyy')) {
              this.prodCarneYear += parseInt(pesaje.peso);
            }
            
            if (pesaje.fecha > ultimoPesoF) {
              ultimoPesoF = pesaje.fecha;
              ultimoPeso = parseInt(pesaje.peso);
            }
            
          });
          this.pesajeTotal += ultimoPeso; 
        });

        // -------------------------------- SECCIÓN PRODUCCIÓN DE LECHE -----------------------------------
        this.ordeñoSub = this.produccionService.getOrdeños(this.fincaId, animal.id).subscribe(ordeños => {
          ordeños.forEach(ordeño => {
            if (this.mesActual == format(new Date(ordeño.fecha), 'M') && this.yearActual == format(new Date(ordeño.fecha), 'yyyy')) {
              //console.log(this.mesActual, format(new Date(ordeño.fecha), 'M'), this.yearActual, format(new Date(ordeño.fecha), 'yyyy'));
              this.prodLecheMes += parseInt(ordeño.leche);
            }
            
            if (this.yearActual == format(new Date(ordeño.fecha), 'yyyy')) {
              this.prodLecheYear += parseInt(ordeño.leche);
            }
          });
        });
      });
    });
  }

  ionViewDidLeave() {
    this.animalSub.unsubscribe();

    if (this.pesajeSub) {
      this.pesajeSub.unsubscribe();
    }

    if (this.ordeñoSub) {
      this.ordeñoSub.unsubscribe();
    }
  }
}
