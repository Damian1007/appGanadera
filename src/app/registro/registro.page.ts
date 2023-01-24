import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { AutentificarService } from './../services/autentificar.service';

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

  constructor(
    private formBuilder : FormBuilder,
    private autentificarService : AutentificarService,
    private router : Router,
  ) { }

  ngOnInit() {
  }

  registro(){
    if(this.form.valid) {
      const {correo, nombre, apellido, contraseña, confirmarContraseña, pais, telefono, departamento, ciudad} = this.form.getRawValue();
      this.autentificarService.registro(correo, contraseña)
      .then(() => {
        this.router.navigate(['/seleccionar-finca']);
      })
      .catch(error => {
        console.error(error);
      });
    } else {
      this.form.markAllAsTouched();
    }
  }

}
