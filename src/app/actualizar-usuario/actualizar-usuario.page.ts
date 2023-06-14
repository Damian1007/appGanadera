import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription, map } from 'rxjs';
import { Usuario } from '../interfaces/usuario';
import { AutentificarService } from '../services/autentificar.service';
import { IonModal } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { OverlayEventDetail } from '@ionic/core/components';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-actualizar-usuario',
  templateUrl: './actualizar-usuario.page.html',
  styleUrls: ['./actualizar-usuario.page.scss'],
})
export class ActualizarUsuarioPage implements OnInit {
  @ViewChild(IonModal) modal: IonModal;
  
  usuario : Usuario;
  usuarioId : any = localStorage.getItem("usuarioId");
  usuarioSub : Subscription;
  dptoSub : Subscription;
  citySub : Subscription;
  isSubmitted = false;
  regex: RegExp = /^\d{7,15}$/;

  isModalOpen = false;
  isModalOpen2 = false;
  departamentos : any[];
  departamentosAux : any[];
  dpto : any;
  dptoCodigo : any;
  ciudades : any[];
  ciudadesAux : any[];
  ciud : any;

  form = this.formBuilder.group({
    correo: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
    nombre: ['', [Validators.required]],
    apellido: ['', [Validators.required]],
    contrasena: [''],
    pais: ['', [Validators.required]],
    telefono: ['', [Validators.required, Validators.pattern(this.regex)]],
    departamento: ['', [Validators.required]],
    ciudad: ['', [Validators.required]],
  });

  constructor(
    private formBuilder : FormBuilder,
    private autentificarService : AutentificarService,
    private router : Router,
    private http : HttpClient, 
    public toastController : ToastController
  ) { 
    this.usuario = {
      correo: '',
      nombre: '',
      apellido: '',
      contrasena: '',
      pais: '',
      telefono: '',
      departamento: '',
      ciudad: '',
    }
   }

  ngOnInit() {
    this.usuarioSub = this.autentificarService.getUsuario(this.usuarioId).subscribe(usuario => {
      this.form.setValue({
        correo: usuario.correo,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        contrasena: usuario.contrasena,
        pais: usuario.pais,
        telefono: usuario.telefono,
        departamento: usuario.departamento,
        ciudad: usuario.ciudad,
      });
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

  actualizarUsuario() {
    this.isSubmitted = true;

    if(this.form.valid) {
      this.usuario.correo = this.form.getRawValue().correo;
      this.usuario.nombre = this.form.getRawValue().nombre;
      this.usuario.apellido = this.form.getRawValue().apellido;
      this.usuario.contrasena = this.form.getRawValue().contrasena;
      this.usuario.pais = this.form.getRawValue().pais;
      this.usuario.telefono = this.form.getRawValue().telefono;
      this.usuario.departamento = this.form.getRawValue().departamento;
      this.usuario.ciudad = this.form.getRawValue().ciudad;

      this.autentificarService.updateUsuario(this.usuario, this.usuarioId)
      .then(() => {
        this.presentToast();
        this.router.navigate(['/usuario'], { replaceUrl: true });
      })
      .catch(error => {
        console.log('Error al Actualizar usuario', error);
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
      message: 'El usuario fue actualizado con exito',
      duration: 5000,
      position: "bottom",
      cssClass: "toast-custom"
    });
    toast.present()
  }

  async presentToastError() {
    const toast = await this.toastController.create({
      message: 'Error al intentar actualizar el usuario, intentelo nuevamente',
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
