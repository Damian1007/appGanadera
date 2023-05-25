import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { FincaService } from '../services/finca.service';
import { Finca } from '../interfaces/finca';
import { Miembro } from '../interfaces/miembro';
import { AutentificarService } from '../services/autentificar.service';
import { Subscription, map } from 'rxjs';
import { AlertasService } from '../services/alertas.service';
import { Alertas } from '../interfaces/alertas';
import { format } from 'date-fns';
import { OverlayEventDetail } from '@ionic/core/components';
import { IonModal } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { ToastController } from '@ionic/angular';
import { AlmacenamientoService } from '../services/almacenamiento.service';

@Component({
  selector: 'app-crear-finca',
  templateUrl: './crear-finca.page.html',
  styleUrls: ['./crear-finca.page.scss'],
})
export class CrearFincaPage implements OnInit {
  @ViewChild(IonModal) modal: IonModal;

  form : FormGroup;
  finca : Finca;
  alertas : Alertas;
  miembro : Miembro;
  usuarioId = localStorage.getItem('usuarioId');
  usuarioSub : Subscription;
  dptoSub : Subscription;
  citySub : Subscription;
  randomId : number;
  isSubmitted = false;

  mostrarFoto = 'assets/icon/imagen_camara.png';
  nuevoFile : any;

  isModalOpen = false;
  isModalOpen2 = false;
  departamentos : any[];
  departamentosAux : any[];
  dpto : any;
  dptoCodigo : any;
  ciudades : any[];
  ciudadesAux : any[];
  ciud : any;
  
  constructor(
    private formBuilder : FormBuilder,
    private router : Router,
    private fincaService : FincaService,
    private auth : AutentificarService,
    private alertasService : AlertasService,
    private http : HttpClient, 
    public toastController : ToastController,
    private almacenamientoService : AlmacenamientoService
  ) { 
      this.finca = {
        id: '',
        nombre: '',
        orientacion: '',
        areaFinca: '',
        areaGanaderia: '',
        foto: '',
        departamento: '',
        ciudad: '',
        corregimiento: '',
        coordenadas: '',
        propietario: this.usuarioId
      };

      this.miembro = {
        id : this.usuarioId,
        rol : 'Propietario',
        nombre : '',
        apellido : ''
      };

      this.alertas = {
        usuario: '',
        cambio: '',
        foto: '',
        fecha: ''
      };
    }

  ngOnInit() {
    this.form = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      orientacion: ['', [Validators.required]],
      areaFinca: ['', [Validators.required, Validators.pattern('[0-9]+')]],
      areaGanaderia: ['', [Validators.required, Validators.pattern('[0-9]+')]],
      //foto: ['', [Validators.required]],
      departamento: ['', [Validators.required]],
      ciudad: ['', [Validators.required]],
      corregimiento: ['', [Validators.required]],
    });

    this.dptoSub = this.getDpto().subscribe(dptos => {
      this.departamentos = dptos;
      this.departamentosAux = dptos;
    });

    this.citySub = this.getCity().subscribe(ciudades => {
      this.ciudades = ciudades;
      this.ciudadesAux = ciudades;
    });
  }

  ionViewWillEnter() {
    this.randomId = Math.floor(Math.random() * 255);

    this.usuarioSub = this.auth.getUsuario(this.usuarioId).subscribe(usuario => {
      this.alertas.usuario = usuario.nombre
      this.miembro.nombre = usuario.nombre;
      this.miembro.apellido = usuario.apellido;
    });
  }

  ionViewDidLeave() {
    this.usuarioSub.unsubscribe();
    this.citySub.unsubscribe();
    this.dptoSub.unsubscribe();
  }

  // --------------------------------------------- SearchBars ------------------------------------------------
  buscarDpto(ev : any) {
    const text = ev.target.value;
    
    if(text && text.trim() != '') {
      this.departamentosAux = this.departamentosAux.filter((depto : any) => {
        return (depto.depto.toLowerCase().indexOf(text.toLowerCase()) > -1);
      })
    }else{
      this.departamentosAux = this.departamentos;
    }
  }

  buscarCiudad(ev : any) {
    const text = ev.target.value;
    
    if(text && text.trim() != '') {
      this.ciudadesAux = this.ciudadesAux.filter((ciudad : any) => {
        return (ciudad.Ciudad.toLowerCase().indexOf(text.toLowerCase()) > -1);
      })
    }else{
      this.ciudadesAux = this.ciudades;
    }
  }

  // ---------------------------------- Cambios y Consultas Departamento y Ciudad -------------------------------------------------
  getDpto() {
    return this.http.get("assets/archivos/departamentos.json").pipe( map((res:any) => {
      return res.data;
    }));
  }

  getCity() {
    return this.http.get("assets/archivos/ciudades.json").pipe( map((res:any) => {
      return res.data;
    }));
  }

  dptoChange(e : any) {
    this.dpto = e.depto;
    this.dptoCodigo = e.codigo;
    this.ciudadesAux = this.ciudades;

    this.ciudadesAux = this.ciudadesAux.filter((ciudades : any) => {
      return (ciudades.Depto == this.dptoCodigo);
    })
    this.ciud = '';

    this.setOpen(false, 1);
  }

  ciudadChange(e : any) {
    this.ciud = e.Ciudad;
    //console.log(this.ciud['Depto']);
    this.setOpen(false, 2);
  }
// -----------------------------------------------------------------------------------------------------------------

setOpen(isOpen : boolean, num : any) {
  if(num == 1) {
    this.isModalOpen = isOpen;
  }
  if(num == 2) {
    this.isModalOpen2 = isOpen;
  }
}

  crearFinca() {
    this.isSubmitted = true;

    if(this.form.valid) {
      this.finca.nombre = this.form.getRawValue().nombre;
      this.finca.orientacion = this.form.getRawValue().orientacion;
      this.finca.areaFinca = this.form.getRawValue().areaFinca;
      this.finca.areaGanaderia = this.form.getRawValue().areaGanaderia;
      this.finca.departamento = this.form.getRawValue().departamento;
      this.finca.ciudad = this.form.getRawValue().ciudad;
      this.finca.corregimiento = this.form.getRawValue().corregimiento;
      this.finca.id = this.finca.nombre +  '_' + this.finca.areaFinca + this.finca.areaGanaderia + '_' + this.finca.corregimiento + this.randomId;
      this.nuevaImagen()
      .then(() => {
        this.alertas.cambio = 'Creo la finca ' + this.finca.nombre;
        this.alertas.foto = this.finca.foto;
        this.alertas.fecha = format(new Date(), 'yyyy-MM-dd');

        this.fincaService.addFinca(this.finca, this.miembro)
        .then(() => {
          this.alertasService.addAlerta(this.alertas, this.finca.id);
          this.presentToast();
          this.router.navigate(['/seleccionar-finca'], { replaceUrl: true });
        })
        .catch(error => {
          console.log('Error al Crear finca', error);
          this.presentToastError();
        });
      })
      .catch(error => {
        console.log('Error al subir la imagen', error);
        this.presentToastError2();
      });
    } else {
      this.form.markAllAsTouched();
    }
  }

  mostrarImagen(event : any) {
    if (event.target.files && event.target.files[0]) {
      this.nuevoFile = event.target.files[0];

      const reader = new FileReader();
      reader.onload = ((image) => {
        this.mostrarFoto = image.target.result as string;
      });
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  async nuevaImagen() {
    const path = 'fincas';
    const nombre = this.finca.id;
    const res = await this.almacenamientoService.subirImagen(this.nuevoFile, path, nombre);
    this.finca.foto = res;
  }

  get errorControl() {
    return this.form.controls;
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Nueva finca creada con exito',
      duration: 5000,
      position: "bottom",
      cssClass: "toast-custom-class"
    });
    toast.present()
  }

  async presentToastError() {
    const toast = await this.toastController.create({
      message: 'Error al intentar crear la nueva finca, intentelo nuevamente',
      duration: 5000,
      position: "bottom",
      cssClass: "custom-toast"
    });
    toast.present()
  }

  async presentToastError2() {
    const toast = await this.toastController.create({
      message: 'Error al intentar subir la imagen, intentelo nuevamente',
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
    }
  }
}
