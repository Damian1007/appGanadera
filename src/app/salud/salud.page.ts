import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SaludService } from '../services/salud.service';
import { Salud } from '../interfaces/salud';
import { Subscription } from 'rxjs';
import { IonModal } from '@ionic/angular';
import { FormBuilder, Validators } from '@angular/forms';
import { OverlayEventDetail } from '@ionic/core/components';
import { AlertasService } from '../services/alertas.service';
import { Alertas } from '../interfaces/alertas';
import { AutentificarService } from '../services/autentificar.service';
import { FincaService } from '../services/finca.service';
import { format, parseISO } from 'date-fns';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-salud',
  templateUrl: './salud.page.html',
  styleUrls: ['./salud.page.scss'],
})
export class SaludPage implements OnInit {
  @ViewChild(IonModal) modal: IonModal;

  historias : Salud[];
  historia : Salud;
  alertas : Alertas;
  fincaId : any;
  animalId : any;
  usuarioId : any;
  animalNombre : any;
  saludSub : Subscription;
  usuarioSub : Subscription;
  fincaSub : Subscription;

  isModalOpen = false;
  isModalOpen2 = false;
  isModalOpen3 = false;
  isSubmitted = false;
  fechaValor = '';

  form = this.formBuilder.group({
    ref: ['', [Validators.required]],
    nombre: ['', [Validators.required]],
    sintomas: ['', [Validators.required]],
    nomMedicamento: ['', [Validators.required]],
    canMedicamento: ['', [Validators.required]],
    fecha: [''],
  });

  constructor( 
    private saludService : SaludService,
    private router : Router,
    private formBuilder : FormBuilder,
    private alertasService : AlertasService,
    private autentificarService : AutentificarService,
    private fincaService : FincaService, 
    public toastController : ToastController
  ) { 
      this.historias = [{
        ref: '',
        nombre: '',
        sintomas: '',
        nomMedicamento: '',
        canMedicamento: '',
        fecha: ''
      }];

      this.historia = {
        ref: '',
        nombre: '',
        sintomas: '',
        nomMedicamento: '',
        canMedicamento: '',
        fecha: ''
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
  }

  ionViewWillEnter(){
    this.fincaId = localStorage.getItem('id');
    this.animalId = localStorage.getItem('animalId');
    this.usuarioId = localStorage.getItem('usuarioId');
    this.animalNombre = localStorage.getItem('animalNombre');

    this.saludSub = this.saludService.getHistorias(this.fincaId, this.animalId).subscribe(historias => {
      this.historias = historias;

      this.historias.sort(function (a, b) {
        if (a.fecha > b.fecha) {
          return -1;
        }

        if (a.fecha < b.fecha) {
          return 1;
        }
        
        // a must be equal to b
        return 0;
      });
    });

    this.usuarioSub = this.autentificarService.getUsuario(this.usuarioId).subscribe(usuario => {
      this.alertas.usuario = usuario.nombre;
    });

    this.fincaSub = this.fincaService.getFinca(this.fincaId).subscribe(finca => {
      this.alertas.foto = finca.foto;
    });

    this.alertas.fecha = format(new Date(), 'yyyy-MM-dd');
  }

  ionViewDidLeave() {
    this.setOpen(false, 1);
    this.setOpen(false, 2);
    this.setOpen(false, 3);
    this.saludSub.unsubscribe();
    this.usuarioSub.unsubscribe();
    this.fincaSub.unsubscribe();
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

  getId(id : any) {
    localStorage.setItem('saludId', id);
    //console.log(localStorage.getItem('saludId'));
    this.router.navigate(['/historia']);
  }

  tipo() {
    this.isSubmitted = true;
  
    if(this.form.getRawValue().ref) {
      this.isSubmitted = false;
      this.historia.ref = this.form.getRawValue().ref;

      if(this.historia.ref == 'Vacuna') {
        this.form.get('sintomas').setValue('N/A', { onlySelf: true});
        this.form.get('nomMedicamento').setValue('N/A', { onlySelf: true});
        this.form.get('canMedicamento').setValue('N/A', { onlySelf: true});
      }
      //console.log(this.form.getRawValue());
      this.setOpen(false, 1);
      this.setOpen(true, 2);
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
  }

  crearHistoria() {
    this.isSubmitted = true;
    this.form.get('fecha').setValue(this.fechaValor, { onlySelf: true});
    //console.log(this.form.getRawValue());

    if(this.form.valid) {
      this.historia.nombre = this.form.getRawValue().nombre;
      this.historia.sintomas = this.form.getRawValue().sintomas;
      this.historia.nomMedicamento = this.form.getRawValue().nomMedicamento;
      this.historia.canMedicamento = this.form.getRawValue().canMedicamento;
      this.historia.fecha = this.form.getRawValue().fecha;
      //console.log(this.historia);
      this.alertas.cambio = 'Agrego una ' + this.form.getRawValue().ref + ' a ' + this.animalNombre;

      this.saludService.addHistoria(this.fincaId, this.animalId, this.historia)
      .then(() => {
        this.isSubmitted = false;
        this.presentToast();
        this.alertasService.addAlerta(this.alertas, this.fincaId);
      })
      .catch(error => {
        console.log('Error al Crear la historia', error);
        this.presentToastError();
      });

      this.form.reset();
      this.setOpen(false, 2);
      this.setOpen(false, 3);
    } else {
      this.form.markAllAsTouched();
    }
  }

  get errorControl() {
    return this.form.controls;
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Nueva historia medica registrada con exito',
      duration: 5000,
      position: "bottom",
      cssClass: "toast-custom-class"
    });
    toast.present()
  }

  async presentToastError() {
    const toast = await this.toastController.create({
      message: 'Error al intentar registrar una nueva historia medica, intentelo nuevamente',
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
      this.isSubmitted = false;
      this.form.reset();
      this.historia.ref = '';
      this.historia.nombre = '';
      this.historia.sintomas = '';
      this.historia.nomMedicamento = '';
      this.historia.canMedicamento = '';
      this.historia.fecha = '';
    }
  }
}
