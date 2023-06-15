import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AutentificarService } from './../services/autentificar.service';
import { MenuController } from '@ionic/angular';
import { LoadingController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  form : FormGroup;
  isSubmitted = false;
  loading : any;

  constructor(
    private formBuilder : FormBuilder,
    private autentificarService : AutentificarService,
    private router : Router,
    public menuCtrl: MenuController, 
    public toastController : ToastController,
    public loadingController : LoadingController
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

  login(){
    this.isSubmitted = true;
    
    if(this.form.valid) {
      this.presentLoading();

      this.autentificarService.iniciarSesion(this.form.getRawValue().correo, this.form.getRawValue().contrasena)
      .then(() => {

        this.loading.dismiss();
        this.router.navigate(['/seleccionar-finca'], { replaceUrl: true });
      })
      .catch(error => {
        console.error(error, "Error al Iniciar Sesión");
        this.loading.dismiss();
        this.presentToastError();
      });
    } else {
        this.form.markAllAsTouched();
    }
  }

  get errorControl() {
    return this.form.controls;
  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      message: 'Iniciando Sesión...',
      cssClass: "normal"
    });
    await this.loading.present();
  }

  async presentToastError() {
    const toast = await this.toastController.create({
      message: 'El Correo o la Contraseña son incorrectos',
      duration: 5000,
      position: "bottom",
      cssClass: "toast-custom"
    });
    toast.present()
  }
}
