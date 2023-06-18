import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription, map } from 'rxjs';
import { ReproduccionService } from '../services/reproduccion.service';
import { Reproduccion } from '../interfaces/reproduccion';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonModal, LoadingController, ToastController } from '@ionic/angular';
import { format, parseISO } from 'date-fns';
import { OverlayEventDetail } from '@ionic/core/components';
import { AnimalService } from '../services/animal.service';
import { Animal } from '../interfaces/animal';
import { AlertasService } from '../services/alertas.service';
import { Alertas } from '../interfaces/alertas';
import { AutentificarService } from '../services/autentificar.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-reproduccion',
  templateUrl: './reproduccion.page.html',
  styleUrls: ['./reproduccion.page.scss'],
})
export class ReproduccionPage implements OnInit {
  @ViewChild(IonModal) modal: IonModal;

  form : FormGroup;
  form2 : FormGroup;
  eventos : Reproduccion[];
  evento : Reproduccion;
  alertas : Alertas;
  animal : Animal;
  fincaId : any;
  animalId : any;
  animalNombre : any;
  animalGenero : any;
  reproduccionId : any;
  usuarioId : any = localStorage.getItem('usuarioId');
  usuarioSub : Subscription;
  animalSub : Subscription;
  razaSub : Subscription;
  reproduccionesSub : Subscription;
  reproduccionSub : Subscription;
  loading : any;

  embarazo = false;
  isModalOpen = false;
  isModalOpen2 = false;
  isModalOpen3 = false;
  isModalOpen4 = false;
  isModalOpen5 = false;
  isModalOpen6 = false;
  isSubmitted = false;
  fechaValor = '';
  fechaProbable = new Date();
  grupoEtario = '';
  pesoCria = '0';
  fotoCria = 'assets/icon/imagen_camara.png';

  razas : any[];
  razasAux : any[];
  razaSelected : any;
  padres : any[];
  padresAux : any[];
  padreSelected : any;

  constructor(
    private reproduccionService : ReproduccionService,
    private formBuilder : FormBuilder,
    private animalService : AnimalService,
    private alertasService : AlertasService,
    private autentificarService : AutentificarService,
    private http : HttpClient, 
    public toastController : ToastController,
    public loadingController : LoadingController
  ) { 
    this.eventos = [{
      tipo: '',
      nombreToro: '',
      fechaMonta: '',
      nombreCria: '',
      fechaPartoProbable: '',
      fechaParto: ''
    }];

    this.evento = {
      tipo: '',
      nombreToro: '',
      fechaMonta: '',
      nombreCria: '',
      fechaPartoProbable: '',
      fechaParto: ''
    };

    this.alertas = {
      usuario: '',
      cambio: '',
      foto: '',
      fecha: ''
    };

    this.animal = {
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

    this.setTiempo();
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      tipo: [''],
      nombre: ['', [Validators.required]],
      fecha: [''],
    });
  
    this.form2 = this.formBuilder.group({
      id: [''],
      nombre: ['', [Validators.required]],
      genero: ['', [Validators.required]],
      foto: [''],
      ubicacion: ['', [Validators.required]],
      raza: ['', [Validators.required]],
      grupoEtario: [''],
      fechaNacimiento: [''],
      padre: [''],
      madre: [''],
      pesoActual: [''],
    });
  }

  ionViewWillEnter(){
    this.fincaId = localStorage.getItem('id');
    this.animalId = localStorage.getItem('animalId');
    this.animalNombre = localStorage.getItem('animalNombre');
    this.animalGenero = localStorage.getItem('animalGenero');
    this.embarazo = false;

    this.reproduccionesSub = this.reproduccionService.getReproducciones(this.fincaId, this.animalId).subscribe(events => {
      this.eventos = events;

      for (let i = 0; i < this.eventos.length; i++) {
        if(this.eventos[i].tipo == 'Monta') {
          this.embarazo = true;

          const aux = this.eventos.splice(i, 1);
          this.eventos.unshift(aux.pop())
        }
      } 
    });

    this.animalSub = this.animalService.getAnimales(this.fincaId).subscribe(animales => {
      this.padres = animales.filter((animales : any) => {
        return (animales.genero == 'Macho' && animales.grupoEtario == 'Toro');
      });
      this.padresAux = this.padres;
    });

    this.razaSub = this.getRaza().subscribe(razas => {
      this.razas = razas;
      this.razasAux = razas;
    });

    this.usuarioSub = this.autentificarService.getUsuario(this.usuarioId).subscribe(usuario => {
      this.alertas.usuario = usuario.nombre;
    });

    this.alertas.fecha = format(new Date(), 'yyyy-MM-dd');
  }

  ionViewDidLeave() {
    this.reproduccionesSub.unsubscribe();
    this.animalSub.unsubscribe();
    this.razaSub.unsubscribe();
    this.usuarioSub.unsubscribe();

    if (this.reproduccionSub) {
      this.reproduccionSub.unsubscribe();
    }
  }

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
    if(num == 5) {
      this.isModalOpen5 = isOpen;
    }
    if(num == 6) {
      this.isModalOpen6 = isOpen;
    }
  }

  getId(id : any) {
    this.reproduccionSub = this.reproduccionService.getReproduccion(this.fincaId, this.animalId, id).subscribe(evento => {
      this.evento = evento;

      this.setOpen(true, 2);
    });
  }

  // <!----------------------------------- Configuración de Fecha ------------------------------------------->
  setTiempo() {
    this.fechaValor = format(parseISO(format(new Date(), 'yyyy-MM-dd')), 'yyyy/MM/dd');
  }

  tiempoChange(value: any) {
    this.fechaValor = format(parseISO(value), 'yyyy/MM/dd');
    this.setOpen(false, 4);
  }
  // <!------------------------------------------------------------------------------------------------------>

  // -------------------------------- SearchBars, Changes y Get de Padres y Razas ----------------------------
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

  padreChange(padre : any) {
    this.padreSelected = padre.nombre;
    this.setOpen(false, 5);
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

  razaChange(raza : any) {
    this.razaSelected = raza.raza;
    this.setOpen(false, 6);
  }

  getRaza() {
    return this.http.get("assets/archivos/razas.json").pipe( map((res:any) => {
      return res.data;
    }));
  }
  // <!------------------------------------------------------------------------------------------------------>

  agregarMonta() {
    this.isSubmitted = true;
    this.form.get('tipo').setValue('Monta', { onlySelf: true});
    this.form.get('fecha').setValue(this.fechaValor, { onlySelf: true});
    
    if (this.embarazo) {
      //console.log("Ya preñada");

      this.presentToast3();
      this.form.markAllAsTouched();
    }else {
      //console.log(this.form.getRawValue());

      if(this.form.valid) {
        this.presentLoadingMonta();

        this.evento.tipo = this.form.getRawValue().tipo;
        this.evento.nombreToro = this.form.getRawValue().nombre;
        this.evento.fechaMonta = this.form.getRawValue().fecha;
        
        this.fechaProbable = new Date(this.fechaProbable);
        this.evento.fechaPartoProbable = format(new Date(this.fechaProbable.getFullYear(), this.fechaProbable.getMonth() + 9, this.fechaProbable.getDay()), 'yyyy/MM/dd');

        this.alertas.cambio = 'Agrego una monta a ' + this.animalNombre;
        this.alertas.foto = 'assets/icon/Reproduccion 100x 100.png';

        this.form.reset();
        this.setOpen(false, 1);
        this.isSubmitted = false;

        this.reproduccionService.addReproduccion(this.fincaId, this.animalId, this.evento)
        .then(() => {

          this.alertasService.addAlerta(this.alertas, this.fincaId);
          this.loading.dismiss();
          this.presentToast();
        })
        .catch(error => {
          console.log('Error al Agregar monta', error);
          this.loading.dismiss();
          this.presentToastError();
        });
      } else {
        this.form.markAllAsTouched();
      }
    }
  }

  registrarParto() {
    this.form2.get('padre').setValue(this.evento.nombreToro, { onlySelf: true});
    this.form2.get('madre').setValue(this.animalNombre, { onlySelf: true});
    
    this.form.reset();
    this.setOpen(false, 2);
    this.setOpen(true, 3);
  }

  agregarParto() {
    this.isSubmitted = true;

    this.form2.get('id').setValue(this.generarUID(), { onlySelf: true});

    this.evento.tipo = 'Parto';
    this.evento.fechaParto = this.fechaValor;
    this.evento.nombreCria = this.form2.getRawValue().nombre;

    if (this.form2.getRawValue().genero == 'Macho') {
      this.grupoEtario = 'Ternero ordeño';
    } else {
      this.grupoEtario = 'Ternera ordeño';
    }
    this.form2.get('foto').setValue(this.fotoCria, { onlySelf: true});
    this.form2.get('grupoEtario').setValue(this.grupoEtario, { onlySelf: true});
    this.form2.get('fechaNacimiento').setValue(this.fechaValor, { onlySelf: true});
    this.form2.get('pesoActual').setValue(this.pesoCria, { onlySelf: true});

    this.alertas.cambio = 'Agrego el nacimiento de ' + this.evento.nombreCria;
    this.alertas.foto = 'assets/icon/Reproduccion 100x 100.png';
    
    //console.log(this.form2.getRawValue());
    if(this.form2.valid) {
      this.presentLoadingParto();

      this.reproduccionService.updateReproduccion(this.evento, this.fincaId, this.animalId);
      this.animalService.addAnimal(this.form2.getRawValue(), this.fincaId)
      .then(() => {
        
        this.alertasService.addAlerta(this.alertas, this.fincaId);
        this.loading.dismiss();
        this.presentToast2();
      })
      .catch(error => {
        console.log('Error al Agregar parto', error);
        this.loading.dismiss();
        this.presentToastError2();
      });

      this.isSubmitted = false;
      this.embarazo = false;
      this.form.reset();
      this.form2.reset();
      this.setOpen(false, 3);
    } else {
        this.form.markAllAsTouched();
    }
  }

  generarUID(){
    const n = this.form2.getRawValue().nombre;
    let d = new Date().getTime();

    let uid = '_xxxxxxxxxxxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });

    return uid = n + uid;
  }

  get errorControl() {
    return this.form.controls;
  }

  get errorControl2() {
    return this.form2.controls;
  }

  async presentLoadingMonta() {
    this.loading = await this.loadingController.create({ 
      message: 'Guardando Monta...',
      cssClass: "normal"
    });
    await this.loading.present();
  }

  async presentLoadingParto() {
    this.loading = await this.loadingController.create({
      message: 'Guardando Parto...',
      cssClass: "normal"
    });
    await this.loading.present();
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Nueva monta registrada con exito',
      duration: 5000,
      position: "bottom",
      cssClass: "toast-custom-class"
    });
    toast.present()
  }

  async presentToast2() {
    const toast = await this.toastController.create({
      message: 'Nuevo parto registrado con exito',
      duration: 5000,
      position: "bottom",
      cssClass: "toast-custom-class"
    });
    toast.present()
  }

  async presentToast3() {
    const toast = await this.toastController.create({
      message: 'La vaca ya ha sido montada y se encuentra gestando',
      duration: 5000,
      position: "bottom",
      cssClass: "toast-custom-class"
    });
    toast.present()
  }

  async presentToastError() {
    const toast = await this.toastController.create({
      message: 'Error al intentar registrar una nueva monta, intentelo nuevamente',
      duration: 5000,
      position: "bottom",
      cssClass: "toast-custom-class"
    });
    toast.present()
  }

  async presentToastError2() {
    const toast = await this.toastController.create({
      message: 'Error al intentar registrar un nuevo parto, intentelo nuevamente',
      duration: 5000,
      position: "bottom",
      cssClass: "toast-custom-class"
    });
    toast.present()
  }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    //console.log(ev.detail.role);

    if (ev.detail.role === 'backdrop') {
      this.setOpen(false, 1);
      this.setOpen(false, 2);
      this.setOpen(false, 3);
      this.setOpen(false, 4);
      this.setOpen(false, 5);
      this.setOpen(false, 6);
      this.form.reset();
      this.form2.reset();
      this.isSubmitted = false;
    }
  }
}
