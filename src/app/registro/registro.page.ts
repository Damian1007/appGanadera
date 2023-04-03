import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AutentificarService } from './../services/autentificar.service';
import { Usuario } from '../interfaces/usuario';
import { IonModal } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

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
  departamentos : any[];
  dpto : any;
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
      departamento: ['', [Validators.required]],
      ciudad: ['', [Validators.required]],
    });

    this.dptoSub = this.getDpto().subscribe(dptos => {
      this.departamentos = dptos;
    });

    this.citySub = this.getCity().subscribe(ciudades => {
      this.ciudades = ciudades;
      this.ciudadesAux = ciudades;
    });
  }

  get errorControl() {
    return this.form.controls;
  }

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

  dptoChange(ev : any) {
    this.dpto = ev.target.value;
  }

  ciudadChange(ev : any) {
    this.ciud = ev.target.value;
  }

  registro(){
    this.isSubmitted = true;
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
  }

}
