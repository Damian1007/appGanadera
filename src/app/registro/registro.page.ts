import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { AutentificarService } from './../services/autentificar.service';
import { Usuario } from '../interfaces/usuario';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {

  form = this.formBuilder.group({
    correo: ['', [Validators.email, Validators.required]],
    nombre: ['', [Validators.required]],
    apellido: ['', [Validators.required]],
    contraseña: ['', [Validators.required]],
    confirmarContraseña: ['', [Validators.required]],
    pais: ['', [Validators.required]],
    telefono: ['', [Validators.required]],
    departamento: ['', [Validators.required]],
    ciudad: ['', [Validators.required]],
  });

  usuario : Usuario

  constructor(
    private formBuilder : FormBuilder,
    private autentificarService : AutentificarService,
    private router : Router 
  ) { 
      this.usuario = {
        id: '',
        correo: '',
        nombre: '',
        apellido: '',
        contraseña: '',
        pais: '',
        telefono: '',
        departamento: '',
        ciudad: ''
      };
    }

  ngOnInit() {
  }

  registro(){
    if(this.form.valid) {
      const {correo, contraseña} = this.form.getRawValue();

      this.autentificarService.registroAuth(correo, contraseña)
      .then(() => {
        this.autentificarService.getUid();
        
        this.usuario.id = localStorage.getItem("usuarioId");
        this.usuario.correo = this.form.getRawValue().correo
        this.usuario.nombre = this.form.getRawValue().nombre
        this.usuario.apellido = this.form.getRawValue().apellido
        this.usuario.contraseña = this.form.getRawValue().contraseña
        this.usuario.pais = this.form.getRawValue().pais
        this.usuario.telefono = this.form.getRawValue().telefono
        this.usuario.departamento = this.form.getRawValue().departamento
        this.usuario.ciudad = this.form.getRawValue().ciudad

        this.autentificarService.registroUsu(this.usuario)
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
