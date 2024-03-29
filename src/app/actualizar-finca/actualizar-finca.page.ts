import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FincaService } from '../services/finca.service';
import { Finca } from '../interfaces/finca';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertasService } from '../services/alertas.service';
import { Alertas } from '../interfaces/alertas';
import { AutentificarService } from '../services/autentificar.service';
import { format } from 'date-fns';
import { Subscription, map } from 'rxjs';
import { IonModal, LoadingController, ToastController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { OverlayEventDetail } from '@ionic/core/components';
import { AlmacenamientoService } from '../services/almacenamiento.service';

@Component({
  selector: 'app-actualizar-finca',
  templateUrl: './actualizar-finca.page.html',
  styleUrls: ['./actualizar-finca.page.scss'],
})
export class ActualizarFincaPage implements OnInit {
  @ViewChild(IonModal) modal: IonModal;

  form : FormGroup;
  finca : Finca;
  alertas : Alertas;
  fincaId : any = localStorage.getItem('id');
  usuarioId : any = localStorage.getItem('usuarioId');
  fincaSub : Subscription;
  usuarioSub : Subscription;
  dptoSub : Subscription;
  citySub : Subscription;
  isSubmitted = false;

  mostrarFoto = '';
  nuevoFile : any;
  cambiaFoto = false;
  loading : any;

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
    private alertasService : AlertasService,
    private autentificarService : AutentificarService,
    private http : HttpClient, 
    private almacenamientoService : AlmacenamientoService,
    public toastController : ToastController,
    public loadingController : LoadingController
  ) { 
      this.finca = {
        id: this.fincaId,
        nombre: '',
        orientacion: '',
        areaFinca: '',
        areaGanaderia: '',
        foto: '',
        departamento: '',
        ciudad: '',
        corregimiento: '',
        vereda_sector: '',
        coordenadas: '',
        propietario: ''
      };

      this.alertas = {
        usuario: '',
        cambio: '',
        foto: 'assets/icon/Actualizar Finca 100x100.jpg',
        fecha: ''
      };
    }

  ngOnInit() {
    this.form = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      orientacion: ['', [Validators.required]],
      areaFinca: ['', [Validators.required, Validators.pattern('[0-9]+')]],
      areaGanaderia: ['', [Validators.required, Validators.pattern('[0-9]+')]],
      foto: ['', [Validators.required]],
      departamento: ['', [Validators.required]],
      ciudad: ['', [Validators.required]],
      corregimiento: ['', [Validators.required]],
      vereda_sector: ['', [Validators.required]],
      coordenadas: [''],
    });

    this.fincaSub = this.fincaService.getFinca(this.fincaId).subscribe(finca => {
      this.form.setValue({
        nombre: finca.nombre,
        orientacion: finca.orientacion,
        areaFinca: finca.areaFinca,
        areaGanaderia: finca.areaGanaderia,
        foto: finca.foto,
        departamento: finca.departamento,
        ciudad: finca.ciudad,
        corregimiento: finca.corregimiento,
        vereda_sector: finca.vereda_sector,
        coordenadas: finca.coordenadas
      });
      this.mostrarFoto = finca.foto;
      this.finca.propietario = finca.propietario;

      this.usuarioSub = this.autentificarService.getUsuario(this.usuarioId).subscribe(usuario => {
        this.alertas.usuario = usuario.nombre;
      });

      this.alertas.fecha = format(new Date(), 'yyyy-MM-dd');
    })

    this.dptoSub = this.getDpto().subscribe(dptos => {
      this.departamentos = dptos;
      this.departamentosAux = dptos;
    });

    this.citySub = this.getCity().subscribe(ciudades => {
      this.ciudades = ciudades;
      this.ciudadesAux = ciudades;
    });
  }

  ionViewDidLeave() {
    this.fincaSub.unsubscribe();
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

  actualizarFinca() {
    this.isSubmitted = true;

    if(this.form.valid) {
      this.presentLoading();

      this.finca.nombre = this.form.getRawValue().nombre;
      this.finca.orientacion = this.form.getRawValue().orientacion;
      this.finca.areaFinca = this.form.getRawValue().areaFinca;
      this.finca.areaGanaderia = this.form.getRawValue().areaGanaderia;
      this.finca.foto = this.form.getRawValue().foto;
      this.finca.departamento = this.form.getRawValue().departamento;
      this.finca.ciudad = this.form.getRawValue().ciudad;
      this.finca.corregimiento = this.form.getRawValue().corregimiento;
      this.finca.vereda_sector = this.form.getRawValue().vereda_sector;
      this.finca.coordenadas = this.form.getRawValue().coordenadas;

      this.alertas.cambio = 'Actualizo la finca ' + this.form.getRawValue().nombre;
      this.nuevaImagen()
      .then(() => {
        
        this.fincaService.updateFinca(this.finca)
        .then(() => {

          this.alertasService.addAlerta(this.alertas, this.fincaId);
          this.loading.dismiss();
          this.presentToast();
          this.router.navigate(['/finca'], { replaceUrl: true });
        })
        .catch(error => {
          this.loading.dismiss();
          this.presentToastError();
          console.log('Error al Actualizar finca', error);
        });
      })
      .catch(error => {
        this.loading.dismiss();
        this.presentToastError2();
        console.log('Error al subir la imagen', error);
      });
    } else {
      this.form.markAllAsTouched();
    }
  }

  mostrarImagen(event : any) {
    if (event.target.files && event.target.files[0]) {
      this.nuevoFile = event.target.files[0];
      this.cambiaFoto = true;

      const reader = new FileReader();
      reader.onload = ((image) => {
        this.mostrarFoto = image.target.result as string;
      });
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  async nuevaImagen() {
    if (this.cambiaFoto) {
      const path = 'fincas_img';
      const nombre = this.fincaId;
      const res = await this.almacenamientoService.subirImagen(this.nuevoFile, path, nombre);
      this.finca.foto = res;
    }
  }

  get errorControl() {
    return this.form.controls;
  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      message: 'Actualizando Finca...',
      cssClass: "normal"
    });
    await this.loading.present();
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'La finca fue actualizada con exito',
      duration: 5000,
      position: "bottom",
      cssClass: "toast-custom-class"
    });
    toast.present()
  }

  async presentToastError() {
    const toast = await this.toastController.create({
      message: 'Error al intentar actualizar la finca, intentelo nuevamente',
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
