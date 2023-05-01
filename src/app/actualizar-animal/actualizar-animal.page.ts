import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription, map } from 'rxjs';
import { Animal } from '../interfaces/animal';
import { AnimalService } from '../services/animal.service';
import { AlertasService } from '../services/alertas.service';
import { Alertas } from '../interfaces/alertas';
import { AutentificarService } from '../services/autentificar.service';
import { FincaService } from '../services/finca.service';
import { format, parseISO } from 'date-fns';
import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { HttpClient } from '@angular/common/http';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-actualizar-animal',
  templateUrl: './actualizar-animal.page.html',
  styleUrls: ['./actualizar-animal.page.scss'],
})
export class ActualizarAnimalPage implements OnInit {
  @ViewChild(IonModal) modal: IonModal;

  animal : Animal;
  alertas : Alertas;
  fincaId : any = localStorage.getItem('id');
  animalId : any = localStorage.getItem('animalId');
  usuarioId : any = localStorage.getItem('usuarioId');
  animalSub : Subscription;
  animalesSub : Subscription;
  usuarioSub : Subscription;
  fincaSub : Subscription;
  razaSub : Subscription;

  isSubmitted = false;
  fechaValor = '';
  isModalOpen = false;
  isModalOpen2 = false;
  isModalOpen3 = false;
  isModalOpen4 = false;
  razas : any[];
  razasAux : any[];
  razaSelected : any;
  padres : any[];
  madres : any[];
  padresAux : any[];
  madresAux : any[];
  padreSelected : any;
  madreSelected : any;

  form = this.formBuilder.group({
    nombre: ['', [Validators.required]],
    genero: ['', [Validators.required]],
    foto: ['', [Validators.required]],
    lote: ['', [Validators.required]],
    raza: ['', [Validators.required]],
    grupoEtario: ['', [Validators.required]],
    fechaNacimiento: [''],
    padre: ['', [Validators.required]],
    madre: ['', [Validators.required]],
    pesoActual: ['', [Validators.required]],
  });
  
  constructor(
    private formBuilder : FormBuilder,
    private router : Router,
    private animalService : AnimalService,
    private alertasService : AlertasService,
    private autentificarService : AutentificarService,
    private fincaService : FincaService,
    private http : HttpClient, 
    public toastController : ToastController
  ) { 
      this.animal = {
        nombre: 'otro',
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

      this.alertas = {
        usuario: '',
        cambio: '',
        foto: '',
        fecha: ''
      };

      this.setTiempo();
    }

  ngOnInit() {
    this.animalSub = this.animalService.getAnimal(this.fincaId, this.animalId).subscribe(animal => {
      this.form.setValue(animal);
      this.animal.foto = animal.foto;

      this.usuarioSub = this.autentificarService.getUsuario(this.usuarioId).subscribe(usuario => {
        this.alertas.usuario = usuario.nombre;
      });

      this.alertas.cambio = 'Actualizo el animal ' + animal.nombre;

      this.fincaSub = this.fincaService.getFinca(this.fincaId).subscribe(finca => {
        this.alertas.foto = finca.foto;
      });

      this.alertas.fecha = format(new Date(), 'yyyy-MM-dd');
    });

    this.animalesSub = this.animalService.getAnimales(this.fincaId).subscribe(animales => {
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

    this.razaSub = this.getRaza().subscribe(razas => {
      this.razas = razas;
      this.razasAux = razas;
    });
  }

  ionViewDidLeave() {
    this.fincaSub.unsubscribe();
    this.usuarioSub.unsubscribe();
    this.animalSub.unsubscribe();
    this.animalesSub.unsubscribe();
    this.razaSub.unsubscribe();
  }

    // <!----------------------------------- Configuración de Fecha ------------------------------------------->
    setTiempo() {
      this.fechaValor = format(parseISO(format(new Date(), 'yyyy-MM-dd')), 'yyyy/MM/dd');
    }
  
    tiempoChange(value: any) {
      this.fechaValor = format(parseISO(value), 'yyyy/MM/dd');
      this.setOpen(false, 3);
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

  buscarRaza(ev : any) {
    const text = ev.target.value;
    
    if(text && text.trim() != '') {
      this.razasAux = this.razasAux.filter((razas : any) => {
        return (razas.raza.toLowerCase().indexOf(text.toLowerCase()) > -1);
      })
    }else{
      this.razasAux = this.razas;
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

  razaChange(raza : any) {
    this.razaSelected = raza.raza;
    this.setOpen(false, 3);
  }

  getRaza() {
    return this.http.get("assets/archivos/razas.json").pipe( map((res:any) => {
      return res.data;
    }));
  }
  // <!------------------------------------------------------------------------------------------------------>

  setOpen(isOpen : boolean, num : any) {
    if(num == 1) {
      this.isModalOpen = isOpen;
    }
    if(num == 2) {
      this.isModalOpen2 = isOpen;
    }
    if(num == 3) {
      this.isModalOpen3 = isOpen;
    }
    if(num == 4) {
      this.isModalOpen4 = isOpen;
    }
  }

  actualizarAnimal() {
    this.isSubmitted = true;
    this.form.get('fechaNacimiento').setValue(this.fechaValor, { onlySelf: true});

    if(this.form.valid) {
      this.animal.nombre = this.form.getRawValue().nombre;
      this.animal.genero = this.form.getRawValue().genero;
      this.animal.foto = this.form.getRawValue().foto;
      this.animal.lote = this.form.getRawValue().lote;
      this.animal.raza = this.form.getRawValue().raza;
      this.animal.grupoEtario = this.form.getRawValue().grupoEtario;
      this.animal.fechaNacimiento = this.form.getRawValue().fechaNacimiento;
      this.animal.padre = this.form.getRawValue().padre;
      this.animal.madre = this.form.getRawValue().madre;
      this.animal.pesoActual = this.form.getRawValue().pesoActual;

      this.animalService.updateAnimal(this.animal, this.fincaId, this.animalId)
      .then(() => {
        this.alertasService.addAlerta(this.alertas, this.fincaId);
        this.presentToast();
        this.router.navigate(['/tabs/animal'], { replaceUrl: true });
      })
      .catch(error => {
        console.log('Error al Actualizar animal', error);
        this.presentToastError();
      });
    } else {
      this.form.markAllAsTouched();
    }
  }

  get errorControl() {
    return this.form.controls;
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'El animal fue actualizado con exito',
      duration: 5000,
      position: "bottom",
      cssClass: "toast-custom-class"
    });
    toast.present()
  }

  async presentToastError() {
    const toast = await this.toastController.create({
      message: 'Error al intentar actualizar el animal, intentelo nuevamente',
      duration: 5000,
      position: "bottom",
      cssClass: "custom-toast"
    });
    toast.present()
  }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;

    if (ev.detail.role === 'backdrop') {
      //console.log(this.evento);
      this.setOpen(false, 1);
      this.setOpen(false, 2);
      this.setOpen(false, 3);
      this.setOpen(false, 4);
    }
  }
}
