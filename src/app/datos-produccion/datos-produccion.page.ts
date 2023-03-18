import { Component, OnInit } from '@angular/core';
import { AnimalService } from '../services/animal.service';
import { Animal } from '../interfaces/animal';
import { Subscription } from 'rxjs';
import { ProduccionService } from '../services/produccion.service';

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

  constructor(
    private animalService : AnimalService,
    private produccionService : ProduccionService
  ) { 
      this.animales = [{
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
          var ultimoPeso = 0;

          pesajes.forEach(pesaje => {
            if (pesaje.fecha > ultimoPesoF) {
              ultimoPesoF = pesaje.fecha;
              ultimoPeso = parseInt(pesaje.peso);
            }
            
          });
          this.pesajeTotal += ultimoPeso; 
        });

        // -------------------------------- SECCIÓN PRODUCCIÓN DE LECHE -----------------------------------


      });
    });
  }

  ionViewDidLeave() {
    this.animalSub.unsubscribe();
    this.pesajeSub.unsubscribe();
  }
}
