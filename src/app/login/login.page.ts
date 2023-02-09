import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { AutentificarService } from './../services/autentificar.service';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  form = this.formBuilder.group({
    correo: ['', [Validators.email, Validators.required]],
    contraseña: ['', [Validators.required]],
  });

  constructor(
    private formBuilder : FormBuilder,
    private autentificarService : AutentificarService,
    private router : Router,
    public menuCtrl: MenuController
  ) { }

  ngOnInit() {
  }

  // ionViewDidEnter() {
  //   this.menuCtrl.enable(false);
  // }

  login(){
    if(this.form.valid) {
        const {correo, contraseña} = this.form.getRawValue();

        this.autentificarService.iniciarSesion(correo, contraseña)
        .then(() => {
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
