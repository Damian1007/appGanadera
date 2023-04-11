import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AnimalService } from '../services/animal.service';
import { AlertasService } from '../services/alertas.service';
import { Alertas } from '../interfaces/alertas';
import { AutentificarService } from '../services/autentificar.service';
import { FincaService } from '../services/finca.service';
import { format, parseISO } from 'date-fns';
import { Subscription } from 'rxjs';
import { Animal } from '../interfaces/animal';
import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';

@Component({
  selector: 'app-crear-animal',
  templateUrl: './crear-animal.page.html',
  styleUrls: ['./crear-animal.page.scss'],
})
export class CrearAnimalPage implements OnInit {
  @ViewChild(IonModal) modal: IonModal;
  
  form : FormGroup;
  animal : Animal;
  alertas : Alertas;
  fincaId : any = localStorage.getItem('id');
  usuarioId : any = localStorage.getItem('usuarioId');
  usuarioSub : Subscription;
  animalSub : Subscription;
  fincaSub : Subscription;

  isSubmitted = false;
  showPicker = false;
  dateValor = format(new Date(), 'yyyy-MM-dd');
  fechaValor = '';
  isModalOpen = false;
  isModalOpen2 = false;
  padres : any[];
  madres : any[];
  padresAux : any[];
  madresAux : any[];
  padreSelected : any;
  madreSelected : any;

  constructor(
    private formBuilder : FormBuilder,
    private router : Router,
    private animalService : AnimalService,
    private alertasService : AlertasService,
    private autentificarService : AutentificarService,
    private fincaService : FincaService
  ) {
      this.animal = {
        nombre: 'otro',
        genero: '',
        foto: "assets/icon/imagen_camara.png",
        lote: '',
        raza: '',
        grupoEtario: '',
        fechaNacimiento: '',
        padre: '',
        madre: '',
        pesoActual: '0'
      };

      this.alertas = {
        usuario: '',
        cambio: '',
        foto: '',
        fecha: ''
      };

      this.setTiempo();
    }

  ngOnInit() {
    this.form = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      genero: ['', [Validators.required]],
      //foto: [''],
      lote: ['', [Validators.required]],
      raza: ['', [Validators.required]],
      grupoEtario: ['', [Validators.required]],
      fechaNacimiento: [''],
      padre: ['', [Validators.required]],
      madre: ['', [Validators.required]],
    });

    this.animalSub = this.animalService.getAnimales(this.fincaId).subscribe(animales => {
      this.padres = animales.filter((animales : any) => {
        return (animales.genero == 'Macho' && animales.grupoEtario == 'Toro');
      });
      this.padres.push(this.animal);
      this.padresAux = this.padres;
      

      this.madres = animales.filter((animales : any) => {
        return (animales.genero == 'Hembra' && (animales.grupoEtario == 'Novilla de vientre' || animales.grupoEtario == 'Vaca lactante'));
      });
      this.madres.push(this.animal);
      this.madresAux = this.madres;
    });
  }

  ionViewDidLeave() {
    if(this.usuarioSub) {
      this.usuarioSub.unsubscribe();
    }
    this.animalSub.unsubscribe();
  }

  // <!----------------------------------- Configuración de Fecha ------------------------------------------->
  setTiempo() {
    this.fechaValor = format(parseISO(format(new Date(), 'yyyy-MM-dd')), 'yyyy/MM/dd');
  }

  tiempoChange(value: any) {
    this.dateValor = value;
    this.fechaValor = format(parseISO(value), 'yyyy/MM/dd');
    this.showPicker = false;
  }
  // <!------------------------------------------------------------------------------------------------------>
  
  // ------------------------------ SearchBars y Changes de Padres y Madres ----------------------------------
  buscarPadre(ev : any) {
    const text = ev.target.value;
    
    if(text && text.trim() != '') {
      this.padresAux = this.padresAux.filter((padres : any) => {
        return (padres.nombre.toLowerCase().indexOf(text.toLowerCase()) > -1);
      })
    }else{
      this.padresAux = this.padres;
    }
  }

  buscarMadre(ev : any) {
    const text = ev.target.value;
    
    if(text && text.trim() != '') {
      this.madresAux = this.madresAux.filter((madres : any) => {
        return (madres.nombre.toLowerCase().indexOf(text.toLowerCase()) > -1);
      })
    }else{
      this.madresAux = this.madres;
    }
  }

  padreChange(padre : any) {
    this.padreSelected = padre.nombre;
    this.setOpen(false, 1);
  }

  madreChange(madre : any) {
    this.madreSelected = madre.nombre;
    this.setOpen(false, 2);
  }
  // <!------------------------------------------------------------------------------------------------------>

  setOpen(isOpen : boolean, num : any) {
    if(num == 1) {
      this.isModalOpen = isOpen;
    }
    if(num == 2) {
      this.isModalOpen2 = isOpen;
    }
  }

  crearAnimal() {
    this.isSubmitted = true;
    this.form.get('fechaNacimiento').setValue(this.fechaValor, { onlySelf: true});
    
    if(this.form.valid) {
      this.animal.nombre = this.form.getRawValue().nombre;
      this.animal.genero = this.form.getRawValue().genero;
      //this.animal.foto = this.form.getRawValue().foto;
      this.animal.lote = this.form.getRawValue().lote;
      this.animal.raza = this.form.getRawValue().raza;
      this.animal.grupoEtario = this.form.getRawValue().grupoEtario;
      this.animal.fechaNacimiento = this.form.getRawValue().fechaNacimiento;
      this.animal.padre = this.form.getRawValue().padre;
      this.animal.madre = this.form.getRawValue().madre;

      this.usuarioSub = this.autentificarService.getUsuario(this.usuarioId).subscribe(usuario => {
        this.alertas.usuario = usuario.nombre;
      });
  
      this.alertas.cambio = 'Creo el animal ' + this.animal.nombre;
  
      this.fincaSub = this.fincaService.getFinca(this.fincaId).subscribe(finca => {
        this.alertas.foto = finca.foto;
      });
  
      this.alertas.fecha = format(new Date(), 'yyyy-MM-dd');
  
      this.animalService.addAnimal(this.animal, this.fincaId)
      .then(() => {
        this.alertasService.addAlerta(this.alertas, this.fincaId);
  
        this.router.navigate(['/tabs/animales'], { replaceUrl: true });
      })
      .catch(error => {
        console.log('Error al Crear animal', error);
      });
    } else {
      this.form.markAllAsTouched();
    }
  }

  get errorControl() {
    return this.form.controls;
  }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;

    if (ev.detail.role === 'backdrop') {
      //console.log(this.evento);
      this.setOpen(false, 1);
      this.setOpen(false, 2);
    }
  }
}
