import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AutentificarService } from './../services/autentificar.service';
import { Usuario } from '../interfaces/usuario';
import { IonModal } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { OverlayEventDetail } from '@ionic/core/components';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {
  @ViewChild(IonModal) modal: IonModal;
  
  form : FormGroup;
  isSubmitted = false;
  usuario : Usuario;
  dptoSub : Subscription;
  citySub : Subscription;

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
    private autentificarService : AutentificarService,
    private router : Router,
    private http : HttpClient
  ) { 
      this.usuario = {
        correo: '',
        nombre: '',
        apellido: '',
        contrasena: '',
        pais: '',
        telefono: '',
        departamento: '',
        ciudad: ''
      };
    }

  ngOnInit() {
    this.form = this.formBuilder.group({
      correo: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      contrasena: ['', [Validators.required, Validators.minLength(8)]],
      confirmarContrasena: ['', [Validators.required]],
      pais: ['', [Validators.required]],
      telefono: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      departamento: ['', Validators.required],
      ciudad: ['', Validators.required],
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

  registro(){
    this.isSubmitted = true;
    
    if(this.form.getRawValue().contrasena == this.form.getRawValue().confirmarContrasena) {
      if(this.form.valid) {
        const {correo, contrasena} = this.form.getRawValue();
  
        this.autentificarService.registroAuth(correo, contrasena)
        .then(() => {
          this.autentificarService.getUid();
          
          this.usuario.correo = this.form.getRawValue().correo
          this.usuario.nombre = this.form.getRawValue().nombre
          this.usuario.apellido = this.form.getRawValue().apellido
          this.usuario.contrasena = this.form.getRawValue().contrasena
          this.usuario.pais = this.form.getRawValue().pais
          this.usuario.telefono = this.form.getRawValue().telefono
          this.usuario.departamento = this.form.getRawValue().departamento
          this.usuario.ciudad = this.form.getRawValue().ciudad
  
          this.autentificarService.registroUsu(this.usuario, localStorage.getItem("usuarioId"))
          .then(() => {
            this.router.navigate(['/seleccionar-finca'], { replaceUrl: true });
          })
          .catch(error => {
            console.error(error, "Error al registrar Usuario");
          });
        })
        .catch(error => {
          console.error(error, "Error al autentificar Usuario");
        });
  
      } else {
        this.form.markAllAsTouched();
      }
    }else {
      this.form.get('confirmarContrasena').setValue('', { onlySelf: true});
      console.log("Contraseña y Confirmar Contraseña son diferentes");
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
