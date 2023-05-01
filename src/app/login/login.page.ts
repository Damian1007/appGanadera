import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AutentificarService } from './../services/autentificar.service';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  form : FormGroup;
  isSubmitted = false;

  constructor(
    private formBuilder : FormBuilder,
    private autentificarService : AutentificarService,
    private router : Router,
    public menuCtrl: MenuController
  ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      correo: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-ñ]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      contrasena: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  ionViewDidEnter() {
    this.menuCtrl.enable(false);
  }

  get errorControl() {
    return this.form.controls;
  }
  
  login(){
    this.isSubmitted = true;
    
    if(this.form.valid) {
        this.autentificarService.iniciarSesion(this.form.getRawValue().correo, this.form.getRawValue().contrasena)
        .then(() => {
          window.location.reload();
          this.router.navigate(['/seleccionar-finca'], { replaceUrl: true });
        })
        .catch(error => {
          console.error(error, "Error al Iniciar Sesión");
        });
    } else {
        this.form.markAllAsTouched();
    }
  }
}
